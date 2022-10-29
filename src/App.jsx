import './App.css'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faPlus, faMinus, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

export default function App() {
  //User Defined
  const [workLength, setWorkLength] = useState(25)
  const [breakLength, setBreakLength] = useState(5)

  //Functionality
  const [isRunning, setIsRunning] = useState(false)  
  const [sessionMode, setSessionMode] = useState('Work')
  const [timer, setTimer] = useState()
  useEffect(() => {
    if (sessionMode === 'Work') {
      setTimer(workLength*60000)
    }
  }, [workLength])

  //Refs
  const audioRef = useRef()
  const dashOffset = useRef()

  //Animation Controls
  const [animate, setAnimate] = useState({
    animationName: null,
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
    animationDuration: (workLength*60) + 's',
    animationPlayState: 'paused',
    stroke: 'none',
    strokeWidth: '4',
    strokeLinecap:'round',
    strokeDasharray: 754,
    strokeDashoffset: 0 
  })

  useEffect(() => {
    if (sessionMode === 'Work') {
      setTimer(workLength*60000)
      setAnimate({
        ...animate,
        animationName:'work',
        animationDuration: workLength*60 + 's',
      })      
    } else {
      setTimer(breakLength*60000)
      setAnimate({
        ...animate,
        animationName: 'break',
        animationDuration: breakLength*60 + 's',
      })
    }
  },[sessionMode])

  //Timer and formatting for display
  let hours = Math.floor(timer / 3600000)
  let hoursLabel = hours.toString().padStart(2, '0')
  let minutes = Math.floor((timer / 60000) % 60)
  let minutesLabel = minutes.toString().padStart(2, '0')
  let seconds = Math.floor((timer / 1000) % 60)
  let secondsLabel = seconds.toString().padStart(2, '0')
  let milliseconds = Math.floor((timer / 10) % 100)
  let millisecondsLabel = milliseconds.toString().padStart(2, '0')

  useEffect(() => {
      const timerId = setInterval(() => {
        if (!isRunning) {
          console.log(`Not Running - clearing timer: ${timerId}`)
          return clearInterval(timerId)
        }
        setTimer(previous => {
          // console.log(`TimerId: ${timerId} -- Time Remaining: ${previous - 10}`)
          if (previous - 10 === 0) {
            // console.log(`Reached 0 - clearing timer: ${timerId}`)
            clearInterval(timerId)
            // console.log(audioRef)
            audioRef.current.play()
            // audioRef.current.onEnded(() => setSessionMode(prev => prev === 'Work' ? 'Break' : 'Work'))

          }
          return previous - 10
        })
      }, 10)
      return () => {
        console.log(`Clean Up - clearing timer: ${timerId}`)
        clearInterval(timerId)
      }
    }, [isRunning, sessionMode])

  // const audioControl = () => {
  //   let audio = new Audio(audioRef.current.src)
  //   audio.play()
  //   return setSessionMode(prev => prev === 'Work' ? 'Break' : 'Work')
  // }
  
  const handlePause = () => {
    setAnimate({
      ...animate,
      animationPlayState: 'paused',
      })
    setIsRunning(false)
    return
  }
  
  const handlePlay = () => {
    setIsRunning(true)
    setAnimate({
      ...animate,
      animationName: (sessionMode === 'Work' ? 'work' : 'break'),
      animationDuration: (sessionMode === 'Work' ? workLength*60 : breakLength*60) + 's',
      animationPlayState: 'running',
      stroke: "turquoise"
    })
    return
  }

  const handleReset = () => {
    setIsRunning(false)
    setAnimate({
      ...animate,
      animationName: null,
      stroke: 'none'
    })
    setTimer(workLength*60000)
    setSessionMode('Work')
    audioRef.current.pause()
    return
  }
  
  return (
    <main>
      <div id='container'>
        <div id='title-box'><h2>Pomodoro Clock</h2></div>
        
        <div id='break-box'>
          
          <FontAwesomeIcon
            id='break-increment'
            icon={faPlus}
            className={isRunning ? "disable" : ''}
            onClick={() => {
              if (breakLength === 60) return
              setBreakLength(prev => prev + 1)
            }}
          />
          
          <div id='break-label'>Break Length</div>
          
          <div id='break-length'>{breakLength}</div>
          
          <FontAwesomeIcon
            id='break-decrement'
            icon={faMinus}
            className={isRunning ? "disable" : ''}
            onClick={() => {
              if (breakLength === 1) return
              setBreakLength(prev => prev - 1)
            }}
          />
          
        </div>
        
        <div id='session-box'>
          
          <FontAwesomeIcon
            id='session-increment'
            icon={faPlus}
            className={isRunning ? "disable" : ''}
            onClick={() => {
              if (workLength === 60) return
              setWorkLength(prev => prev + 1)
            }}
          />
          
          <div id='session-label'>Session Length</div>
          
          <div id='session-length'>{workLength}</div>
          
          <FontAwesomeIcon
            id='session-decrement'
            icon={faMinus}
            className={isRunning ? "disable" : ''}
            onClick={() => {
              if (workLength === 1) return
              setWorkLength(prev => prev - 1)
            }}
          />
          
        </div>
        
        <div id='timer-box'>
          
          <audio
          id="beep"
          preload="auto"
          ref={audioRef}
          volume="0.5"
          onEnded={() => setSessionMode(prev => prev === 'Work' ? 'Break' : 'Work')}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
          <div id='timer-label'>{sessionMode}</div>
          
          <svg width='260' height='260'>
            <circle 
              ref={dashOffset}
              className='defaultCircle'
              style={animate}
              cx='125'
              cy='125'
              r='120'
            />
          </svg>
          
          <div id='time-left'>
            {hours ?
              <>
                <div id='hours'>
                  <div>{hoursLabel}</div>
                  <span>HRS</span>
                </div>
                <div className='seperator'>:</div>
              </>
            : null}

            {hours || minutes ?
              <>
                <div id='minutes'>
                  <div>{minutesLabel}</div>
                  <span>MINS</span>
                </div>
                <div className='seperator'>:</div>
              </>
            : null}

            {hours || minutes || seconds ?
              <>
                <div id='seconds'>
                  <div>{secondsLabel}</div>
                  <span>SEC</span>
                </div>
                {/*<div className='seperator'>:</div>*/}
              </>
            : null}
  
            {!hours && !minutes && !seconds  ?
              <>
                <div id='milliseconds'>
                  <div>{millisecondsLabel}</div>
                  <span>MS</span>
                </div>
              </>
            : null}

          </div>

          <div id='timer-control-box'>
            {isRunning ? 
              <FontAwesomeIcon
                id='start_stop'
                icon={faPause}
                size="lg"
                fixedWidth
                onClick={handlePause}/>
            : 
             <FontAwesomeIcon
               id='start_stop'
               icon={faPlay}
               size="lg"
               fixedWidth
               onClick={handlePlay}
            />
            }
            
            <FontAwesomeIcon
              id='reset'
              icon={faSyncAlt}
              size="lg"
              fixedWidth
              onClick={handleReset}
            />
           
          </div>
        </div>
        <div id='footer'>
          <p>Designed and Coded By WDPronovost</p>
        </div>
      </div>
    </main>
  )
}