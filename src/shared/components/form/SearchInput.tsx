import React, { useState, useCallback } from 'react';
import { Input, Icon } from '@8base/boost';

const SearchInput: React.FC<Props> = ({ 
  initialValue = '',
  stretch = false, 
  width,
  onSearch
}) => {
  const [search, setSearch] = useState(initialValue);

  const handleSearch = useCallback(() => {
    onSearch(search);
  }, [search, onSearch])

  return (
    <Input
      width={width}
      stretch={stretch}
      name="search"
      value={search}
      onChange={setSearch}
      rightIcon={
        <Icon 
          name="Search" 
          size="sm" 
          cursor="pointer"
          onClick={handleSearch}
        />
      }
    />
  )
}

type Props = {
  initialValue?: string,
  width: number,
  stretch?: boolean,
  onSearch: (value: string) => void
}

export default SearchInput;