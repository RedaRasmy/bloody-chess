import { ChessTimer, ChessTimerOption, ChessTimerType } from "../types";

export function parseTimer(timerOption:ChessTimerOption):ChessTimer {
    const [type,time] = timerOption.split(" ")
    const [base,plus] = time.split("+")


    return {
        type : type as ChessTimerType  ,
        base : Number(base)*60 ,
        plus  : Number(plus)
    }
    
}