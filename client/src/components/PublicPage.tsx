import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  VStack,
  Box,
  Image,
  Heading,
  Text,
  Tooltip,
  HStack,
  Icon,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  SunIcon,
  MoonIcon,
  EditIcon,
} from "@chakra-ui/icons";

interface Link {
  _id: string;
  title: string;
  url: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function PublicPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/links`);
        setLinks(response.data);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };
    fetchLinks();
  }, []);

  const cardBg = useColorModeValue("blue.50", "gray.700");
  const cardHoverBg = useColorModeValue("blue.100", "gray.600");
  const textColor = useColorModeValue("black", "white");
  const linkIconColor = useColorModeValue("blue.500", "cyan.300");
  const subTextColor = useColorModeValue("gray.500", "gray.300");

  return (
    <Container maxW="container.sm" py={10}>
      <Box position="relative" w="full">
        {/* Dark mode toggle top-right */}
        <Button
          position="absolute"
          top={0}
          right={0}
          onClick={toggleColorMode}
          variant="ghost"
          size="sm"
        >
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>

        {/* Profile Section */}
        <VStack spacing={3} align="center">
          <Image
            src={colorMode === "light" ? "/cat-light.jpg" : "/cat-dark.jpg"}
            borderRadius="full"
            boxSize="100px"
          />
          <Heading as="h2" size="lg" pl={2}>
            Jiaqi Zhang
          </Heading>
          <Text color={subTextColor} textAlign="center">
            Welcome to my page! Here are some of my important links.
          </Text>
        </VStack>

        {/* Admin button */}
        <Box mt={6} textAlign="center">
          <Button
            as="a"
            href="/admin"
            colorScheme="blue"
            size="md"
            leftIcon={<EditIcon />}
          >
            Edit Links
          </Button>
        </Box>
      </Box>

      {/* Links Section */}
      <VStack spacing={4} width="100%" mt={10} align="stretch">
        {links.map((link) => (
          <Tooltip
            key={link._id}
            label={link.url}
            fontSize="sm"
            placement="top"
            hasArrow
          >
            <Box
              as="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              width="100%"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
              bg={cardBg}
              _hover={{
                bg: cardHoverBg,
                boxShadow: "md",
                textDecoration: "none",
              }}
              transition="all 0.2s"
            >
              <HStack justify="space-between">
                <Text fontWeight="medium" color={textColor} pl={2}>
                  {link.title}
                </Text>
                <Icon as={ExternalLinkIcon} w={5} h={5} color={linkIconColor} />
              </HStack>
            </Box>
          </Tooltip>
        ))}
      </VStack>
    </Container>
  );
}
