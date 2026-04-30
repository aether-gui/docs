import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/reference/aether-ops/api-overview"
            style={{marginLeft: '1rem'}}>
            API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  description: string;
};

const features: FeatureItem[] = [
  {
    title: 'Build, Bootstrap, Operate',
    description:
      'Aether Ops ships a small, focused set of tools — aether-ops, aether-ops-bootstrap, build-bundle, patch-bundle — that together cover producing offline release artifacts, installing them onto airgapped hosts, and running an Aether deployment on top.',
  },
  {
    title: 'Standard Telco Stack',
    description:
      'SD-Core for the 5G Core, srsRAN / UERANSIM / OAI / gNBSim for RAN, RKE2 for Kubernetes, all driven by Aether OnRamp under aether-ops. Production-shaped components, deployable on a laptop or a fleet.',
  },
  {
    title: 'Secure by Default',
    description:
      'TLS with auto-generated certificates, mutual TLS for machine-to-machine auth, bearer token protection, and AES-256-GCM encryption for stored credentials. Bootstrap is fully airgapped — no network requests at install time.',
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md padding-vert--lg">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
