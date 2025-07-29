'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import './TableCarousel.css' // Using specific CSS for table carousel

export default function TableCarousel({ tableData, title }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: true, // Enable infinite loop
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])
  return (
    <div className="w-full px-4">
      {title && <h2 className="text-xl font-semibold mb-4" style={{ textTransform: 'none' }}>{title}</h2>}

      <div className="embla overflow-hidden relative" ref={emblaRef}>
        <div className="embla__container flex gap-6">
          {Array.isArray(tableData) ? (
            tableData.map((classItem, index) => (
              <div key={index} className="embla__slide flex-[0_0_auto] min-w-0">
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
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Category</td>
                        <td className="px-4 py-3 text-sm text-gray-500 border-b">
                          {classItem.classCategory || '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : typeof tableData === 'object' ? (
            Object.entries(tableData).map(([key, classItem], index) => (
              <div key={index} className="embla__slide flex-[0_0_auto] min-w-0">
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
                          {Array.isArray(classItem.instructors) 
                            ? classItem.instructors.map((name) => name.split('-')[0].trim()).join(', ')
                            : classItem.instructors || '-'}
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
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-bold text-white bg-black border-b">Category</td>
                        <td className="px-4 py-3 text-sm text-gray-500 border-b">
                          {classItem.classCategory || '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="embla__slide flex-[0_0_auto] min-w-0">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-500">
                No class schedule data available
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Arrows */}
        <button
          className="embla__button embla__button--prev"
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          ◀
        </button>
        <button
          className="embla__button embla__button--next"
          onClick={scrollNext}
          aria-label="Next slide"
        >
          ▶
        </button>
      </div>
    </div>
  )
} 