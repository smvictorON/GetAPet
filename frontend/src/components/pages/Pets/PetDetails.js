import styles from './PetDetails.module.css'
import api from '../../../utils/api'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'

const PetDetails = () => {
  const [pet, setPet] = useState({})
  const { id } = useParams()
  const { setFlashMessage } = useFlashMessage()
  const [token] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    api.get(`/pets/${id}`).then((res) => {
      setPet(res.data.pet)
    }).catch((err) => console.log(err))
  }, [id])

  const schedule = async () => {
    let msgType = "success"

    const data = await api.patch(`/pets/schedule/${pet._id}`, {}, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      },
    }).then((res) => {
      return res.data
    }).catch((err) => {
      msgType = 'error'
      return err.response.data
    })

    setFlashMessage(data.message, msgType)
  }

  return (
    <>
      {pet.name && (
        <section className={styles.pet_details_container}>
          <div className={styles.pet_details_header}>
            <h1>Conhecendo o Pet: {pet.name}</h1>
            <p>Se tiver interesse marque uma visita para conheçe-lo!</p>
          </div>

          <div className={styles.pet_images}>
            {pet.images.map((img, index) => (
              <img src={`${process.env.REACT_APP_API}/images/pets/${img}`} alt={pet.name} key={index} />

            ))}
          </div>

          <p>
            <span className='bold'>Peso: </span> {pet.weight}kg
          </p>
          <p>
            <span className='bold'>Idade: </span> {pet.age} anos
          </p>

          {token ? (
            <button onClick={schedule}>Solicitar uma visita!</button>
          ) : (
            <p>Você precisa <Link to="/register">criar uma conta</Link> para solicitar a visita!</p>
          )}
        </section>
      )}
    </>
  )
}

export default PetDetails