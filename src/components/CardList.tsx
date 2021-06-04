import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface CardProp {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: CardProp[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure()

  const [imageUrlSelected, setImageUrlSelected] = useState('');

  function handleOpenModal(url: string): void {
    onOpen();
    setImageUrlSelected(url);
  }

  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing="40px">
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={url => handleOpenModal(url)}
          />
        ))}
      </SimpleGrid>

      {isOpen && (
        <ModalViewImage 
          isOpen={isOpen}
          imgUrl={imageUrlSelected}
          onClose={onClose}
        />
      )}
    </>
  );
}
