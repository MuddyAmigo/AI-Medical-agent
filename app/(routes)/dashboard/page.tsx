"use client"
import React from 'react'
import HistoryList from './_component/HistoryList'
import DoctorsAgentList from './_component/DoctorsAgentList'
import {AddNewSessionDialog} from './_component/AddNewSessionDialog'

function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <AddNewSessionDialog />
      </div>
      <HistoryList />
      <DoctorsAgentList />
    </div>
  )
}

export default Dashboard
