import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  Text,
  Input,
  HStack,
  Select,
} from "@chakra-ui/react";

export default function DisplayCoins() {
  const [coinData, setCoinData] = useState([]);
  const [sortData, setSortData] = useState("");
  const [currency, setCurrency] = useState("inr");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function getCoins() {
    try {
      let url = `https://api.coingecko.com/api/v3/coins/markets?per_page=10&page=${
        page || 1
      }`;
      if (sortData && currency) {
        url += `&vs_currency=${currency}&order=market_cap_${sortData}`;
      } else if (sortData) {
        url += `&order=market_cap_${sortData}`;
      } else if (currency) {
        url += `&vs_currency=${currency}`;
      }
      let res = await axios.get(url);
      setCoinData(res.data);
      // console.log(url);
      // console.log(sortData, currency, page);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  async function getSingleCoinDatabyId(val) {
    try {
      let url = `https://api.coingecko.com/api/v3/coins/${val}`;
      let res = await axios(url);
      setCoinData(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCoins();
  }, [sortData, currency, page]);

  function handleSort(val) {
    setSortData(val);
  }

  function handleCurrency(val) {
    // console.log(val);
    setCurrency(val);
  }

  function handlePageChange(val) {
    setPage(val);
  }

  function handleSearch(val) {
    setSearch(val);
    // console.log(val);
    getSingleCoinDatabyId(val);
  }

  return (
    <Box>
      <h1
        style={{
          textAlign: "center",
          fontSize: "30px",
          fontWeight: "Bold",
          margin: "15px",
          padding: "10px",
          border: "1px solid black",
          borderRadius: "10px",
        }}
      >
        Coins Data
      </h1>
      <HStack>
        <Box>
          <Input
            placeholder="Search for coins"
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
        </Box>
        <Box>
          <Select
            placeholder="Sort By:"
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </Select>
        </Box>
        <Box>
          <Select
            placeholder="Change Currency:"
            onChange={(e) => handleCurrency(e.target.value)}
            value={currency}
          >
            <option value="inr">INR</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </Select>
        </Box>
      </HStack>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Symbol</Th>
              <Th>Current Price</Th>
              <Th>24h Change</Th>
              <Th>Market Cap</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coinData.length > 0 &&
              coinData.map((item) => {
                return (
                  <>
                    <Tr key={item.id} onClick={onOpen}>
                      <Td>
                        <Image
                          src={`${item.image}`}
                          alt={`${item.name}`}
                          w={"50px"}
                        />
                      </Td>
                      <Td>{item.name}</Td>
                      <Td>{item.symbol}</Td>
                      <Td>{item.current_price}</Td>
                      <Td>{item.price_change_percentage_24h}%</Td>
                      <Td>{item.market_cap}</Td>
                    </Tr>

                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Coin Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Text>Market Cap Rank: {item.market_cap_rank}</Text>
                          <Text>Image: </Text>
                          <Image
                            src={`${item.image}`}
                            alt={`${item.name}`}
                            w={"50px"}
                          />
                          <Text>Name: {item.name}</Text>
                          <Text>Symbol: {item.symbol}</Text>
                          <Text>Current Price: {item.current_price}</Text>
                          <Text>
                            Price Change 24 Hour: {item.price_change_24h}
                          </Text>
                          <Text>Total Volume: {item.total_volume}</Text>
                          <Text>Low 24 hour: {item.low_24h}</Text>
                          <Text>High 24 Hour: {item.high_24h}</Text>
                          <Text>Total Supply: {item.total_supply}</Text>
                          <Text>Max Supply: {item.max_supply}</Text>
                          <Text>
                            Circulating Supply: {item.circulating_supply}
                          </Text>
                          <Text>All Time High (ath): {item.ath}</Text>
                          <Text>Last Updated Date: {item.last_updated}</Text>
                        </ModalBody>

                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>

      {new Array(10).fill().map((item, ind) => {
        return (
          <Button key={ind} onClick={(e) => handlePageChange(ind + 1)}>
            {ind + 1}
          </Button>
        );
      })}
    </Box>
  );
}
