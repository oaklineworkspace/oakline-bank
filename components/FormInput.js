import styles from '../styles/FormInput.module.css';

export default function FormInput({ label, placeholder }) {
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <input type="text" placeholder={placeholder} />
    </div>
  );
}
