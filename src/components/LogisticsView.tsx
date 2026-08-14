import React, { useState } from 'react';
import { DispatchJob, OrderStatus } from '../types';
import { MOCK_DISPATCH_JOBS } from '../data/mockFarmData';
import { Truck } from 'lucide-react';

export const LogisticsView: React.FC = () => {
  const [jobs, setJobs] = useState<DispatchJob[]>(MOCK_DISPATCH_JOBS);

  const handleAdvanceStatus = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          let nextStatus: OrderStatus = j.status;
          let nextStep = j.currentStepIndex;

          if (j.status === 'RIDER_DISPATCHED') {
            nextStatus = 'IN_TRANSIT';
            nextStep = 2;
          } else if (j.status === 'IN_TRANSIT') {
            nextStatus = 'DELIVERED';
            nextStep = 3;
          }

          return { ...j, status: nextStatus, currentStepIndex: nextStep };
        }
        return j;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-[#2e7d32] px-3 py-1 rounded-full font-bold text-[10px] uppercase border border-emerald-200">
            3PL Partners: Gokada • Kwik • Max.ng
          </span>
          <h1 className="font-heading text-xl font-extrabold text-stone-900 mt-2">Lagos Statewide Dispatch & Transit Tracker</h1>
          <p className="text-stone-500 text-xs mt-0.5 font-medium">
            Live last-mile delivery tracking across all 20 Local Government Areas of Lagos State.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#f3f7f4] px-4 py-2.5 rounded-2xl border border-emerald-100 text-xs font-bold text-emerald-950">
          <Truck className="w-5 h-5 text-[#2e7d32]" />
          <div>
            <span className="text-stone-500 text-[10px] uppercase block">RIDER PERSONA</span>
            <span>Tunde Bakare (Gokada #884)</span>
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-extrabold text-stone-900">Active Lagos Produce Deliveries</h2>

        {jobs.map(job => {
          const isDelivered = job.status === 'DELIVERED';
          return (
            <div
              key={job.id}
              className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#2e7d32] text-white flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-base font-extrabold text-stone-900">{job.orderId}</h3>
                      <span className="bg-stone-100 text-stone-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border border-stone-200">
                        {job.vehicleType}
                      </span>
                    </div>
                    <p className="text-stone-500 text-xs mt-0.5 font-medium">
                      Distance: <span className="text-[#2e7d32] font-bold">{job.distanceKm} km</span> across Lagos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold border ${
                      isDelivered
                        ? 'bg-emerald-100 text-[#2e7d32] border-emerald-200'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {job.status.replace('_', ' ')}
                  </span>

                  {!isDelivered && (
                    <button
                      onClick={() => handleAdvanceStatus(job.id)}
                      className="bg-[#2e7d32] hover:bg-[#1b4332] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xs"
                    >
                      {job.status === 'RIDER_DISPATCHED' ? 'Mark Picked Up' : 'Mark Delivered'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="bg-[#f3f7f4] p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-[#2e7d32] font-bold uppercase block mb-1">
                    📍 PICKUP MARKET ({job.pickupLGA} LGA)
                  </span>
                  <p className="font-bold text-stone-900">{job.pickupLocation}</p>
                </div>

                <div className="bg-[#f3f7f4] p-3.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block mb-1">
                    🏁 DELIVERY ADDRESS ({job.deliveryLGA} LGA)
                  </span>
                  <p className="font-bold text-stone-900">{job.deliveryLocation}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-stone-400 mb-1.5">
                  <span className={job.currentStepIndex >= 0 ? 'text-[#2e7d32]' : ''}>Order Placed</span>
                  <span className={job.currentStepIndex >= 1 ? 'text-[#2e7d32]' : ''}>Vendor Confirmed</span>
                  <span className={job.currentStepIndex >= 2 ? 'text-[#2e7d32]' : ''}>In Transit</span>
                  <span className={job.currentStepIndex >= 3 ? 'text-emerald-700' : ''}>Delivered</span>
                </div>
                <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2e7d32] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((job.currentStepIndex + 1) / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
