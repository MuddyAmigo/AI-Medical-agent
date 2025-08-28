"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/badge'

type doctorAgent = {
  id: number,
  name: string,
  specialty: string,
  description: string,
  image: string,
}

type props = {
  doctorAgent: doctorAgent
  onSelect?: () => void
}

export default function SuggestedDoctorCard({ doctorAgent, onSelect }: props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300 min-h-[180px]">
      <div className="flex flex-col space-y-3">
        {/* Doctor Image and Basic Info */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100">
              <Image 
                src={doctorAgent.image} 
                alt={doctorAgent.name} 
                width={48} 
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 line-clamp-1">
                  Dr. {doctorAgent.name}
                </h4>
                <Badge variant="secondary" className="mt-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs">
                  {doctorAgent.specialty}
                </Badge>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 text-yellow-400 flex-shrink-0">
                <StarIcon className="w-3 h-3 fill-current" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 px-1">
          {doctorAgent.description}
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="text-xs text-gray-500">
            <span className="inline-flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              Available now
            </span>
          </div>
          
          <Button 
            size="sm" 
            onClick={onSelect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs h-7"
          >
            Select
            <ArrowRightIcon className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}