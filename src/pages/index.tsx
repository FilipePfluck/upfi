import { Button, Box, Spinner } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

type fetchImagesResponse = {
  data: Card[];
  after: string | null;
};

export default function Home(): JSX.Element {

  async function fetchImages({
    pageParam = null,
  }): Promise<fetchImagesResponse> {
    const { data } = await api.get(`/api/images`, {
      params: {
        after: pageParam
      }
    })

    return data
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    fetchImages, 
    {
      getNextPageParam: lastPage => lastPage.after ?? null,
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
        
        {hasNextPage && (
          <Button
            mt="1rem"
            onClick={() => fetchNextPage()}
            role="button"
            w={['100%', 'auto']}
          >
            {isFetchingNextPage ? <Spinner/> : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
