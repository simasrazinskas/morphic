'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { clearChats } from '@/lib/actions/chat'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Spinner } from './ui/spinner'

type ClearHistoryProps = {
  empty: boolean
}

export function ClearHistory({ empty }: ClearHistoryProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={empty}>
          Išvalyti istoriją
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ar tikrai norite išvalyti?</AlertDialogTitle>
          <AlertDialogDescription>
            Šio veiksmo negalima atšaukti. Tai visam laikui ištrins jūsų
            istoriją ir pašalins jūsų duomenis iš mūsų serverių.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Atšaukti</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={event => {
              event.preventDefault()
              startTransition(async () => {
                const result = await clearChats()
                if (result?.error) {
                  toast.error(result.error)
                } else {
                  toast.success('Istorija išvalyta')
                }
                setOpen(false)
              })
            }}
          >
            {isPending ? <Spinner /> : 'Išvalyti'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
