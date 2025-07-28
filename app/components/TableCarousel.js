'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'

export default function TableCarousel({ tableData, title }) {
  return (
    <div className="w-full px-4">
      {title && <h2 className="text-xl font-semibold mb-4" style={{ textTransform: 'none' }}>{title}</h2>}

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={24}
        slidesPerView={1.2}
        breakpoints={{
          768: {
            slidesPerView: 2.2,
          },
          1024: {
            slidesPerView: 3.2,
          },
        }}
      >
        {Array.isArray(tableData) ? (
          tableData.map((classItem, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                
                {/* Table Content - Same 2-column structure */}
                <table className="w-full">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Class Name</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.className || `Class ${index + 1}`}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Dance Forms</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {Array.isArray(classItem.danceForms) ? classItem.danceForms.join(', ') : classItem.danceForms || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Instructors</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.instructors || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Days</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.days || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Time</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.time || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Level</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.level || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Fee</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.fee || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SwiperSlide>
          ))
        ) : typeof tableData === 'object' ? (
          Object.entries(tableData).map(([key, classItem], index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                
                {/* Table Content - Same 2-column structure */}
                <table className="w-full">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Class Name</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.className  || `Class ${index + 1}`}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Dance Forms</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {Array.isArray(classItem.danceForms) ? classItem.danceForms.join(', ') : classItem.danceForms || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Instructors</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.instructors.map((name) => name.split('-')[0].trim()).join(', ') || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Days</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.days || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Time</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.time || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Level</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.level || '-'}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Fee</td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b">
                        {classItem.fee || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-500">
              No class schedule data available
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  )
} 