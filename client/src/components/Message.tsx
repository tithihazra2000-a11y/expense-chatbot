export default function Message({ text, sender }: any) {
  return (
    <div style={{
      textAlign: sender === 'user' ? 'right' : 'left',
      margin: '5px 0'
    }}>
      <span style={{
        background: sender === 'user' ? 'purple' : '#eee',
        color: sender === 'user' ? 'white' : 'black',
        padding: '6px 10px',
        borderRadius: '10px',
        display: 'inline-block'
      }}>
        {text}
      </span>
    </div>
  )
}