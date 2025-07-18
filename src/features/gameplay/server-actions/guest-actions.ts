'use server'

import {db} from '@/db/drizzle'
import {guests } from '@/db/schema' 

export async function getGuest(id:string) {
    const guest = await db.query.guests.findFirst({
        where : (guests,{eq}) => eq(guests.id , id)
    })
    return guest
}

export async function createGuest() {
    const displayName = 'guest-' + Math.floor(Math.random()*99_999)
    const guest = await db.insert(guests).values({
        displayName 
    }).returning()
    return guest[0]
}
