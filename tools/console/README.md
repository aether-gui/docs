# ISO console capture

Boots the built ISO under QEMU with a VNC display and no window, so frames of GRUB, the unattended
installer, and the first-boot setup dialogs can be grabbed headlessly.

## Requirements

- `qemu-system-x86_64` with KVM access (run through `sudo` when `/dev/kvm` is root-only), the
  OVMF firmware package (`/usr/share/OVMF/OVMF_CODE_4M.fd`), and `vncdotool`
  (`pipx install vncdotool`).
- A built ISO from the `aether-ops-iso` repository.

## Use

```bash
# 1. Install (ends with a power-off)
sudo ISO=/path/to/aether-ops-0.1.0-amd64.iso tools/console/run-iso.sh &
tools/console/capture.sh install-01-grub          # a few seconds after start
tools/console/capture.sh install-02-installer-log # a minute in

# 2. First boot from the installed disk
sudo ISO=/path/to/aether-ops-0.1.0-amd64.iso tools/console/run-iso.sh boot-from-disk &
tools/console/capture.sh first-boot-01-welcome    # about a minute in
```

`capture.sh <name>` writes `src/assets/screenshots/iso/<name>.png`. Drive dialogs with
`vncdo -s 127.0.0.1::5909 key enter`, `key tab`, and `type <text>`; note that `vncdo type` sends
shifted characters unshifted on a US layout, so `(`, `)`, `@`, `|` and `:` need `key shift-<key>`.

The VM boots UEFI on purpose: the ISO's disk layout cannot finish a legacy-BIOS install. The QEMU
monitor socket lives at `/tmp/aether-iso-monitor.sock` (`system_reset`, `quit`); the serial
console is logged to `WORK/serial.log`.
