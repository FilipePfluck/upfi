import { Button, Box } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ResponseProps {
  after ?: any
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async () => {
      const { data } = await api.get(`/api/images`, {
        params: {
          after: null
        }
      })

      return data
    }
  );

  const formattedData = useMemo(() => {
    if(data){
      return data.pages.flat(2).map(teste => teste.data).flat()
    }else{
      return []
    }
  }, [data]);

  useEffect(()=>{
    console.log(formattedData)
  },[formattedData])
  
  if(isLoading){
    return <Loading/>
  }

  if(isError){
    return <Error/>
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
