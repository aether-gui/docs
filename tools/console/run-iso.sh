#!/usr/bin/env bash
# Boots the Aether Ops ISO under QEMU with a VNC display and no window, so
# frames of GRUB, the installer, and the first-boot setup screen can be grabbed
# headlessly with capture.sh. The disk is a throwaway qcow2 in WORK.
#
# Usage: ISO=path/to/aether-ops-<ver>-amd64.iso tools/console/run-iso.sh [boot-from-disk]
#   First run: boots the ISO (install, then powers off).
#   Second run with "boot-from-disk": boots the installed disk (first boot).
#
# Requires qemu-system-x86_64 with KVM access (run via sudo if /dev/kvm is
# root-only). VNC listens on 127.0.0.1:5909; the serial console is logged to
# WORK/serial.log so capture timing can key off installer output. The monitor
# socket lives in /tmp because UNIX socket paths are limited to 107 bytes.
set -euo pipefail
WORK=${WORK:-$(dirname "$0")/work}
ISO=${ISO:?set ISO to the built ISO path}
MEM=${MEM:-8G}
CPUS=${CPUS:-4}
DISK="$WORK/disk.qcow2"
mkdir -p "$WORK"
[ -f "$DISK" ] || qemu-img create -f qcow2 "$DISK" 100G >/dev/null
# UEFI firmware: the installed disk layout (GPT, ESP + btrfs root, no BIOS boot
# partition) cannot complete a legacy-BIOS install, so the VM must boot UEFI.
OVMF_CODE=${OVMF_CODE:-/usr/share/OVMF/OVMF_CODE_4M.fd}
OVMF_VARS_SRC=${OVMF_VARS_SRC:-/usr/share/OVMF/OVMF_VARS_4M.fd}
[ -f "$WORK/OVMF_VARS.fd" ] || cp "$OVMF_VARS_SRC" "$WORK/OVMF_VARS.fd"
args=(
  -enable-kvm -m "$MEM" -smp "$CPUS" -cpu host -machine q35
  -drive "if=pflash,format=raw,readonly=on,file=$OVMF_CODE"
  -drive "if=pflash,format=raw,file=$WORK/OVMF_VARS.fd"
  -drive "file=$DISK,if=virtio,format=qcow2"
  -nic user,model=virtio-net-pci
  -display none -vnc 127.0.0.1:9
  -serial "file:$WORK/serial.log"
  -monitor "unix:${MONITOR_SOCK:-/tmp/aether-iso-monitor.sock},server,nowait"
  -pidfile "$WORK/qemu.pid"
)
if [ "${1:-}" != "boot-from-disk" ]; then
  args+=(-cdrom "$ISO" -boot d)
fi
exec qemu-system-x86_64 "${args[@]}"
