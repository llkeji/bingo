import React, { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { useBing } from '@/lib/hooks/use-bing'
import VoiceIcon from '@/assets/images/voice.svg'
import VoiceButton from './ui/voice'
import { SR } from '@/lib/bots/bing/sr'
import { voiceListenAtom } from '@/state'
import { SVG } from './ui/svg'

const sr = new SR(['发送', '清空', '退出'])

const Voice = ({ setInput, input, sendMessage, isSpeaking }: Pick<ReturnType<typeof useBing>, 'setInput' | 'sendMessage' | 'input' | 'isSpeaking'>) => {
  const setListen = useSetAtom(voiceListenAtom)
  useEffect(() => {
    if (sr.listening) return
    sr.transcript = !isSpeaking
  }, [isSpeaking])

  useEffect(() => {
    sr.onchange = (msg: string, command?: string) => {
      switch (command) {
        case '退出':
          sr.stop()
          break;
        case '发送':
          sendMessage(input)
        case '清空':
          setInput('')
          break;
        default:
          setInput(input + msg)
      }
    }
  }, [input, setInput, sendMessage])

  const switchSR = (enable: boolean = false) => {
    setListen(enable)
    if (enable) {
      sr.start()
    } else {
      sr.stop()
    }
  }

  return sr.listening ? (
    <VoiceButton onClick={() => switchSR(false)} />
  ) : (
    <SVG className="cursor-pointer" alt="start voice" src={VoiceIcon} width={26} height={22} onClick={() => switchSR(true)} />
  )
};

export default Voice;
