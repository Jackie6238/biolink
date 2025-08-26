import axios from "axios";
import {
  Container,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
  Box,
  Grid,
  Collapse,
  useBreakpointValue,
  useToast,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SunIcon,
  MoonIcon,
} from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

interface ILink {
  _id: string;
  title: string;
  url: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminPage() {
  const [links, setLinks] = useState<ILink[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingUrl, setEditingUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isAddOpen, setIsAddOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("isAddOpen");
    return saved ? JSON.parse(saved) : true;
  });

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const panelBg = useColorModeValue("white", "gray.700");
  const panelHoverBg = useColorModeValue("gray.50", "gray.600");
  const inputBg = useColorModeValue("white", "gray.600");

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

  useEffect(() => {
    if (editingId && titleInputRef.current) titleInputRef.current.focus();
  }, [editingId]);

  useEffect(() => {
    localStorage.setItem("isAddOpen", JSON.stringify(isAddOpen));
  }, [isAddOpen]);

  const handleRowClick = (link: ILink) => {
    if (editingId === link._id) cancelEdit();
    else {
      setEditingId(link._id);
      setEditingTitle(link.title);
      setEditingUrl(link.url);
    }
  };

  const handleEditClick = (link: ILink) => {
    setEditingId(link._id);
    setEditingTitle(link.title);
    setEditingUrl(link.url);
  };

  const saveEdit = async (id: string) => {
    if (!editingTitle.trim() || !editingUrl.trim()) return;
    try {
      const response = await axios.put(`${API_URL}/api/links/${id}`, {
        title: editingTitle,
        url: editingUrl,
      });
      setLinks(links.map((link) => (link._id === id ? response.data : link)));
      setEditingId(null);
      toast({
        title: "Link updated.",
        description: `"${editingTitle}" has been updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Update failed", err);
      toast({
        title: "Update failed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cancelEdit = () => {
    if (editingId) {
      const original = links.find((l) => l._id === editingId);
      if (original) {
        setEditingTitle(original.title);
        setEditingUrl(original.url);
      }
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const deleted = links.find((l) => l._id === id)?.title || "";
    await axios.delete(`${API_URL}/api/links/${id}`);
    setLinks(links.filter((link) => link._id !== id));
    toast({
      title: "Link deleted.",
      description: `"${deleted}" has been deleted.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAdd = async () => {
    if (!newTitle || !newUrl) return;
    try {
      const response = await axios.post(`${API_URL}/api/links`, {
        title: newTitle,
        url: newUrl,
      });
      setLinks([...links, response.data]);
      toast({
        title: "Link added.",
        description: `"${newTitle}" has been added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewTitle("");
      setNewUrl("");
    } catch (err) {
      console.error("Add failed", err);
      toast({
        title: "Add failed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.key === "Enter") saveEdit(id);
    else if (e.key === "Escape") cancelEdit();
  };

  return (
    <Container maxW="container.lg" py={8}>
      <HStack justify="space-between" mb={4}>
        {/* Back to home button */}
        <Button size="sm" onClick={() => navigate("/")}>
          ← Home
        </Button>
        {/* Dark mode toggle */}
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="outline"
        />
      </HStack>

      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">
          Manage Links
        </Heading>

        {/* Add Link Section */}
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          bg={panelBg}
          _hover={{ bg: panelHoverBg }}
        >
          <HStack
            justify="space-between"
            onClick={() => setIsAddOpen(!isAddOpen)}
            cursor="pointer"
          >
            <Heading size="md">Add New Link</Heading>
            <IconButton
              aria-label={isAddOpen ? "Collapse" : "Expand"}
              icon={isAddOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              size="sm"
              variant="outline"
              borderWidth="1px"
            />
          </HStack>

          <Collapse in={isAddOpen} animateOpacity>
            <VStack
              spacing={2}
              mt={3}
              align={isMobile ? "stretch" : "center"}
              direction={isMobile ? "column" : "row"}
            >
              <Input
                placeholder="Link Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                size="md"
                bg={inputBg}
              />
              <Input
                placeholder="Link URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                size="md"
                bg={inputBg}
              />
              <Button colorScheme="blue" onClick={handleAdd} w="full" size="md">
                Add
              </Button>
            </VStack>
          </Collapse>
        </Box>

        {/* Existing Links */}
        <VStack spacing={3} align="stretch">
          {links.map((link) => (
            <Box
              key={link._id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              transition="all 0.3s ease"
              _hover={{ bg: panelHoverBg, cursor: "pointer" }}
              bg={panelBg}
              onClick={() => handleRowClick(link)}
            >
              <Grid
                templateColumns={isMobile ? "1fr 1fr auto" : "2fr 3fr auto"}
                gap={3}
                alignItems="center"
              >
                <Text fontWeight="medium">{link.title}</Text>
                <Text fontSize="sm" color="gray.500">
                  {link.url}
                </Text>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    size="sm"
                    variant="outline"
                    borderColor="gray.400"
                    _hover={{ bg: "gray.100", borderColor: "gray.500" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(link);
                    }}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(link._id);
                    }}
                  />
                </HStack>
              </Grid>

              <Collapse in={editingId === link._id} animateOpacity>
                <VStack spacing={2} mt={2} align="stretch">
                  <Input
                    ref={titleInputRef}
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="Title"
                    onKeyDown={(e) => handleKeyPress(e, link._id)}
                    onClick={(e) => e.stopPropagation()}
                    bg={inputBg}
                  />
                  <Input
                    value={editingUrl}
                    onChange={(e) => setEditingUrl(e.target.value)}
                    placeholder="URL"
                    onKeyDown={(e) => handleKeyPress(e, link._id)}
                    onClick={(e) => e.stopPropagation()}
                    bg={inputBg}
                  />
                  <HStack spacing={4} mt={2}>
                    <Button
                      colorScheme="green"
                      flex={1}
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEdit(link._id);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      colorScheme="gray"
                      flex={1}
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEdit();
                      }}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </Collapse>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}
