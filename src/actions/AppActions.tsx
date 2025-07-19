'use server'
import { currentUser } from "@clerk/nextjs/server";
import prisma from '@/lib/db'
import CryptoJS from 'crypto-js'

const encryptSecret = (text: string) => {
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY!).toString();
}

const decryptSecret = (ciphertext: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY!);
    return bytes.toString(CryptoJS.enc.Utf8);
}