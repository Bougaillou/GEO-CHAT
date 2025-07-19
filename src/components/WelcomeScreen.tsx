import React from 'react'
import { Globe } from 'lucide-react'
import { ASKING_MESSAGE, SUGGESTIONS, WELCOME_MESSAGE } from '@/lib/constant'
import { Card } from './ui/Card'

const WelcomeScreen = () => {
    return (
        <>
            <div className='text-center py-12'>
                <div className='w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Globe className='size-8 text-white' />
                </div>
                <h2 className='text-2xl font-semibold mb-2'>{WELCOME_MESSAGE}</h2>
                <p className='text-gray-600 mb-8' >{ASKING_MESSAGE}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto'>
                    {SUGGESTIONS.map((suggestion, index) => (
                        <Card
                            key={index}
                            className='p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200'
                        >
                            <h3 className='font-medium mb-3'>{`${suggestion.icon} ${suggestion.title}`}</h3>
                            <p className='text-sm text-gray-600'>{suggestion.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}

export default WelcomeScreen