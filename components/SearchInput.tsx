"use client";

import { Input, Icon } from "semantic-ui-react";
import { useState, useEffect, ChangeEvent } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceTime?: number;
}

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
  debounceTime = 300,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!value) {
      setIsSearching(false);
      onSearch("");
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      onSearch(value);
      setIsSearching(false);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [value, onSearch, debounceTime]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <Input
      icon={
        isSearching ? (
          <Icon name="spinner" loading />
        ) : value ? (
          <Icon name="close" link onClick={handleClear} />
        ) : (
          "search"
        )
      }
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      fluid
    />
  );
}
