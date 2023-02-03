import { useState, useEffect } from 'react'
import styles from './AddPet.module.css'
import api from '../../../utils/api'
import { useParams } from 'react-router-dom'
import useFlashMessage from '../../../hooks/useFlashMessage'
import PetForm from '../../form/PetForm'

const EditPet = () => {
  const [pet, setPet] = useState({})
  const [token] = useState(localStorage.getItem('token') || '')
  const { id } = useParams()
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    api.get(`/pets/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((res) => {
      setPet(res.data.pet)
    })
  }, [token, id])

  const updatePet = async (pet) => {
    let msgType = "success"

    const formData = new FormData

    await Object.keys(pet).forEach((key) => {
      if (key === 'images') {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append('images', pet[key][i])
        }
      } else {
        formData.append(key, pet[key])
      }
    })

    const data = await api.patch(`/pets/${pet._id}`, formData, {
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
    <section className={styles.addpet_header}>
      <div>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição os dados ficarão atualizados no sistema.</p>
      </div>
      {pet.name && <PetForm btnText="Atualizar" handleSubmit={updatePet} petData={pet} />}
    </section>
  )
}

export default EditPet