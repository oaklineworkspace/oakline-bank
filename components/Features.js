// components/Features.js
import styles from '../styles/Features.module.css';
import CardItem from './CardItem';

export default function Features() {
  const features = [
    {
      title: 'Instant Account Setup',
      description: 'Open an account and start banking online in minutes with our seamless signup process.',
      icon: '/icons/instant.png',
    },
    {
      title: 'Secure & Trusted',
      description: 'Your money and data are protected with top-notch security protocols and encryption.',
      icon: '/icons/security.png',
    },
    {
      title: '24/7 Customer Support',
      description: 'Get assistance anytime with our round-the-clock support team.',
      icon: '/icons/support.png',
    },
  ];

  return (
    <section className={styles.features}>
      <h2>Why Choose Oakline Bank</h2>
      <div className={styles.cardContainer}>
        {features.map((feature, index) => (
          <CardItem
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  );
}
