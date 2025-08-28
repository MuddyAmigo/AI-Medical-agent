"use client"

import React from 'react'
import {AIDoctorAgents} from '@/shared/list'
import DoctorAgentCard from './DoctorAgentCard'

export default function DoctorsAgentList() {
  return (
    <div className='mt-10'>
        <h2 className='text-xl font-bold mb-5'>AI Specialist Doctor</h2>

        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
          {AIDoctorAgents.map((doctor, index) => {
            const mappedDoctor = {
              ...doctor,
              name: doctor.specialist, // Map 'specialist' to 'name'
              specialty: doctor.specialist // Or map appropriately if 'specialty' is different
            };
            return (
              <div key={index}>
                <DoctorAgentCard doctorAgent={mappedDoctor} />
              </div>
            )
          })}
        </div>
      </div>
  )
}
