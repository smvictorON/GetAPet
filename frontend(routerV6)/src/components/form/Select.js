import styles from './Select.module.css'

const Select = ({ text, name, options, handleOnChange, value }) => {
	return (
		<div className={styles.form_control}>
			<label htmlFor={name}>{text}:</label>
			<select name={name} value={value || ''} onChange={handleOnChange} id={name}>
				<option>Selecione uma opção</option>
				{options.map((opt) => (
					<option value={opt} key={opt}>{opt}</option>
				))}
			</select>
		</div>
	)
}

export default Select