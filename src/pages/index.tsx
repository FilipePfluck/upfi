import { Button, Box, Spinner, useDisclosure, SimpleGrid } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

import { Card } from '../components/Card';
import { ModalViewImage } from '../components/Modal/ViewImage';

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

  const observer = useRef<any>()

  const { onOpen, isOpen, onClose } = useDisclosure()

  const [imageUrlSelected, setImageUrlSelected] = useState('');

  function handleOpenModal(url: string): void {
    onOpen();
    setImageUrlSelected(url);
  }

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
  
  const lastElementRef = useCallback((element)=>{
    if(isLoading) return

    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })

    if(element) {
        observer.current.observe(element)
    }
  },[isLoading, hasNextPage])

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
    <div>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <SimpleGrid columns={[1, 2, 3]} spacing="40px">
          {formattedData.map((card, index) => {
            if(formattedData.length === index + 1){
              return(
                <Card
                  key={card.id}
                  data={card}
                  viewImage={url => handleOpenModal(url)}
                  ref={lastElementRef}
                />
              )
            }else{
              return (
                <Card
                  key={card.id}
                  data={card}
                  viewImage={url => handleOpenModal(url)}
                />
              )
            }
          })}
        </SimpleGrid>

        {isOpen && (
          <ModalViewImage 
            isOpen={isOpen}
            imgUrl={imageUrlSelected}
            onClose={onClose}
          />
        )}
        
        {hasNextPage && isFetchingNextPage && (
          <Spinner/>
        )}
      </Box>
    </div>
  );
}
