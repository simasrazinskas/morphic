// Keep the example messages array for reference
const exampleMessages = [
  {
    heading: 'Kas yra DeepSeek R1?',
    message: 'Kas yra DeepSeek R1?'
  },
  {
    heading: 'Kodėl Nvidia sparčiai auga?',
    message: 'Kodėl Nvidia sparčiai auga?'
  },
  {
    heading: 'Tesla prieš Rivian',
    message: 'Tesla prieš Rivian'
  },
  {
    heading: 'Santrauka: https://arxiv.org/pdf/2501.05707',
    message: 'Santrauka: https://arxiv.org/pdf/2501.05707'
  }
]

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  // Return null to hide the component
  return null

  /* Original rendering code kept as comments
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-2 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
  */
}
