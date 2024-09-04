import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { FolderIcon } from '@heroicons/react/24/outline'

const sibs = [
    { id: 1, name: 'SIB:10103 - Something wrong with IGX', url: '#' },
    // More sibs...
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [query, setQuery] = useState('')

  const filteredSibs =
    query === ''
      ? []
      : sibs.filter((project) => {
          return project.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
   
      <div className="flex items-center justify-center p-4">
    
          <div className="w-full max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-gray-900 shadow-2xl transition-all">
            <Combobox onChange={(item: { url: string }) => (window.location = item.url as unknown as Location)}>
              <div className="relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  onChange={(event) => setQuery(event.target.value)}
                  onBlur={() => setQuery('')}
                />
              </div>

              {filteredSibs.length > 0 && (
                <Combobox.Options
                  static
                  as="ul"
                  className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                >
                  <li className="p-2">
                    <ul className="text-sm text-gray-400">
                      {filteredSibs.map((project) => (
                        <Combobox.Option
                            key={project.id}
                            value={project}
                            className={({ active }) =>
                                classNames(
                                    'absolute z-10 flex cursor-default select-none items-center rounded-md px-3 py-2',
                                    active ? 'bg-gray-800 text-white' : ''
                                )
                            }
                        >
                          {({ active }) => (
                            <>
                              <a href={project.url}>
                                <FolderIcon
                                  className={classNames('h-6 w-6 flex-none', active ? 'text-white' : 'text-gray-500')}
                                  aria-hidden="true"
                                />
                                <span className="ml-3 flex-auto truncate text-white">{project.name}</span>
                              </a>
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </ul>
                  </li>
                </Combobox.Options>
              )}

              {query !== '' && filteredSibs.length === 0 && (
                <div className="px-6 py-14 text-center sm:px-14">
                  <FolderIcon className="mx-auto h-6 w-6 text-gray-500" aria-hidden="true" />
                  <p className="mt-4 text-sm text-gray-200">
                    We couldn't find any sibs with that term. Please try again.
                  </p>
                </div>
              )}
            </Combobox>
          </div>
      </div>
 
  )
}
