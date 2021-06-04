import {
  Box,
  Heading,
  Text,
  Image,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { useState, forwardRef, ForwardRefRenderFunction } from 'react';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
}

interface CardProps {
  data: Card;
  viewImage: (url: string) => void;
}

const CardBase: ForwardRefRenderFunction<HTMLDivElement,CardProps> = ({ data, viewImage },ref) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box key={data.ts} borderRadius="md" bgColor="pGray.800" ref={ref}>
      <Skeleton isLoaded={!isLoading}>
        <Image
          src={data.url}
          alt={data.title}
          objectFit="cover"
          w="max"
          h={48}
          borderTopRadius="md"
          onClick={() => viewImage(data.url)}
          onLoad={() => setIsLoading(false)}
          cursor="pointer"
        />
      </Skeleton>

      <Box pt={5} pb={4} px={6}>
        {isLoading ? (
          <>
            <SkeletonText fontSize="2xl" mt={2} noOfLines={1} />
            <SkeletonText fontSize="md" mt={7} noOfLines={1} />
          </>
        ) : (
          <>
            <Heading fontSize="2xl">{data.title}</Heading>
            <Text mt={2.5} fontSize="md">
              {data.description}
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
}

export const Card = forwardRef(CardBase)