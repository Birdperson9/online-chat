import React, { useState, useEffect } from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import { ID, Query, Role, Permission } from 'appwrite'
import { Trash2 } from 'react-feather'
import { useAuth } from '../utils/AuthContext'
import Header from '../components/Header'

const Room = () => {
  const [messages, setMessages] = useState([])
  const [messageBody, setMessageBody] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    getMessages()

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          console.log('A message was created')
          setMessages((prevState) => [response.payload, ...prevState])
        }

        if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          console.log('A message was deleted')
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          )
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    }

    let permissions = [Permission.write(Role.user(user.$id))]

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions
    )

    setMessageBody('')
  }

  const getMessages = async () => {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES, [
      Query.orderDesc('$createdAt'),
      Query.limit(20),
    ])
    setMessages(response.documents)
  }

  const deleteMessage = async (id) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id)
  }

  return (
    <main className='container'>
      <Header />
      <div className='room--container'>
        <form id='message--form' onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength='250'
              placeholder='Say something...'
              onChange={(e) => {
                setMessageBody(e.target.value)
              }}
              value={messageBody}
            ></textarea>
          </div>

          <div className='send-btn--wrapper'>
            <input className='btn btn--secondary' type='submit' value='send' />
          </div>
        </form>

        <div>
          {messages.map((message) => (
            <div key={message.$id} className={'message--wrapper'}>
              <div className='message--header'>
                <p>
                  {message?.username ? (
                    <span>{message.username}</span>
                  ) : (
                    <span>Anonymous user</span>
                  )}

                  <small className='message-timestamp'>
                    {' '}
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>

                {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                  <Trash2
                    className='delete--btn'
                    onClick={() => {
                      deleteMessage(message.$id)
                    }}
                  />
                )}
              </div>
              <div className='message--body'>
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Room
