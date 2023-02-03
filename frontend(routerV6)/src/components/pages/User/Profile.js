import { useState, useEffect } from 'react'
import styles from './Profile.module.css'
import formStyles from '../../form/Form.module.css'
import Input from '../../form/Input'
import api from '../../../utils/api'
import useFlashMessage from '../../../hooks/useFlashMessage'
import RoundedImage from '../../layout/RoundedImage'

function Profile() {
  const [user, setUser] = useState({})
  const [preview, setPreview] = useState()
  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    api.get('/users/checkuser', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((res) => {
      setUser(res.data)
    })
  }, [token])

  const onFileChange = (e) => {
    setPreview(e.target.files[0])
    setUser({ ...user, [e.target.name]: e.target.files[0] })
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let msgType = "success"

    const formData = new FormData()

    await Object.keys(user).forEach((key) => {
      formData.append(key, user[key])
    })

    const data = await api.patch(`/users/edit/${user._id}`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      return res.data
    }).catch((err) => {
      msgType = 'error'
      return err.response.data
    })

    setFlashMessage(data.message, msgType)
  }

  return (
    <section>
      <div className={styles.profile_header}>
        <h1>Perfil</h1>
        {(user.image || preview) && (
          <RoundedImage src={preview ? URL.createObjectURL(preview) : `${process.env.REACT_APP_API}/images/users/${user.image}`} alt={user.name} />
        )}
        <p>Preview Imagem</p>
      </div>

      <form className={formStyles.form_container} onSubmit={handleSubmit}>
        <Input
          text="Imagem"
          type="file"
          name="image"
          handleOnChange={onFileChange}
        />
        <Input
          text="Email"
          type="email"
          name="email"
          handleOnChange={handleChange}
          placeholder="Digite seu Email"
          value={user.email || ''}
        />
        <Input
          text="Nome"
          type="text"
          name="name"
          handleOnChange={handleChange}
          placeholder="Digite seu Nome"
          value={user.name || ''}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          handleOnChange={handleChange}
          placeholder="Digite seu Telefone"
          value={user.phone || ''}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          handleOnChange={handleChange}
          placeholder="Digite sua Senha"
          value={user.password || ''}
        />
        <Input
          text="Senha"
          type="password"
          name="confirmpassword"
          handleOnChange={handleChange}
          placeholder="Confirma sua Senha"
        />
        <input type="submit" value="Editar" />
      </form>
    </section>
  )
}
export default Profile