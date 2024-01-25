import styles from './assets/navigationButton.module.css'

const Button = (width, height, text) => {
    return (
        <div className={styles.button}>
            {text}
        </div>
    )
}

export default Button;