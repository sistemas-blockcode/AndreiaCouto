'use client';
import { SearchNormal1 } from 'iconsax-react';
import { useStudents } from '@/app/components/context/StudentsContext';

export default function Searchbar() {
  const { searchTerm, setSearchTerm } = useStudents();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex mb-4 items-center border border-[#e7e7e7] rounded-lg px-2 py-2 bg-white w-full max-w-lg shadow-sm">
      <SearchNormal1 size="20" className="text-gray-500" />
      <input
        type="text"
        placeholder="Pesquisa geral"
        className="ml-3 bg-white outline-none w-full placeholder-gray-500"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
}
