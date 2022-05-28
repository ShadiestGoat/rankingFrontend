import type { Writable } from "svelte/store"

export const CHANGE_TIME = 475

export const animateNumber = (oldNum:number, newNum:number, store:Writable<number>) => {
    const diff = newNum-oldNum
    if (diff == 0) {return}

    const interval = CHANGE_TIME/Math.abs(diff)
    
    const cb = () => {
        oldNum += diff > 0 ? 1 : -1
        store.set(oldNum)
        if (oldNum != newNum) {
            setTimeout(cb, interval)
        }
    }

    setTimeout(cb, interval)
}

export const API_BASE_ORIGIN = process.env.API_BASE_ORIGIN
export const API_PROTCOL = process.env.API_PROTCOL

export const API_BASE = `${!API_PROTCOL ? "" : API_PROTCOL + "://"}${API_BASE_ORIGIN ?? ""}/api`

export const ADMIN_KEY = "asdsad"

export const AdminPass = () => localStorage.getItem(ADMIN_KEY) ?? ""

export type player = {
    elo: number,
    id: string,
    name: string,
}

export type match = {
    player1: player,
    player2: player,
    player1Points: number,
    player2Points: number,
}