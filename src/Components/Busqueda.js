import React, { useEffect } from 'react';
import { SearchBar } from 'react-native-elements/dist/searchbar/SearchBar';
import { Search } from '../Utils/Acciones';

export default function Busqueda(props) {
  const { search, setSearch, setproductList, setmensaje, actualizarCategoria } = props;

  useEffect(() => {
    if (search) {
      (
        async () => {
          const resultados = await Search(search);
          setproductList(resultados);
          if (resultados.length === 0) {
            setmensaje("No se ha encontrado resultados de la busqueda " + search);
          }
        }
      )()
    }else{
      actualizarCategoria();
    }

  }, [search])

  return (
    <SearchBar
      placeholder="¿Qué estás buscando?"
      containerStyle={{ backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
      inputContainerStyle={{ backgroundColor: '#fff', alignItems: 'center' }}
      inputStyle={{ fontFamily: 'Roboto', fontSize: 20 }}
      onChangeText={(text) => {
        setSearch(text);
      }}
      value={search}
      onClear={() => {
        setSearch("");
        setproductList([]);
        actualizarCategoria();
      }
      }
    />
  )
}
