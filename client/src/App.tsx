import Chat from './components/Chat'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d9a7c7, #fffcdc)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Chat />
    </div>
  )
}