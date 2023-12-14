// import React from 'react'

// const Complaint = () => {
//   return (
//     <div className='p-10 flex'>
//       <div className='bg-tint-1 w-96 rounded-2xl mr-7'>
//         <div className='flex flex-col'>
//           <div className='grid grid-cols-2 justify-items-center bg-tint-3 text-xl p-3 rounded-tr-2xl rounded-tl-2xl'>
//             <div>Upload Image</div>
//             <div>Live Capture</div>
//           </div>
//           <div className='my-3 mx-9'>
//             <p className='text-3xl flex-center p-3 mb-16'>Choose Your image</p>
//             <div className='flex-center bg-tint-1 p-3 mb-3'>
//               <input type='file' accept='image/*' h={'50px'} pt={'2'}/>
//             </div>
//             <p className='text-xl p-3'>Location : </p>
//           </div>
//           <div className='flex-center p-10'>
//             <button className='px-16 py-3 text-xl font-bold rounded-lg bg-shades-1'>Submit</button>
//           </div>
//         </div>
//       </div>
//       <div className='bg-tint-1 w-full rounded-2xl'>
//       </div>
//     </div>

//   )
// }

// export default Complaint;
'use client'
import React, { useState } from 'react';
import { Box, Button, Image, Input, VStack, HStack, Text, Heading, FormControl, FormLabel, useToast, SimpleGrid, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { ChakraProvider, Fade } from '@chakra-ui/react';
import UserNav from './UserNav';
// import Footer from './Footer';
import axios from 'axios';
import { useImage } from './ImageContext';
// import CapturePhoto from './CapturePhoto';

const Complain = () => {
    const { imageDetails, setImageDetails } = useImage();
    const [showLiveCaptureSubmit, setShowLiveCaptureSubmit] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [location, setLocation] = useState("");
    const [apiResponse, setApiResponse] = useState(null);
    const toast = useToast();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setCurrentImage(reader.result);
        };
    };

    const handleLiveCapture = (dataUrl) => {
        setCurrentImage(dataUrl);
        setShowLiveCaptureSubmit(true);
        toast({
            title: "Image Captured Successfully.",
            description: "Now, submit the complaint with the captured image.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleUpload = async () => {
        if (currentImage && location) {
            const currentDate = new Date();
            const complaintNumber = imageDetails.length + 1;

            try {
                const response = await axios({
                    method: "POST",
                    url: "https://detect.roboflow.com/garbage-classification-qmp4x/11",
                    params: {
                        api_key: "UZKg5qOB4uV1SEipe4ec"
                    },
                    data: currentImage.split(',')[1],
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });

                if (response && response.data) {
                    console.log(response.data?.predictions[0]?.class);
                    setApiResponse(response.data?.predictions[0]?.class);
                }

                setImageDetails((prevDetails) => {
                    const newDetails = [...prevDetails, {
                        complaintNumber,
                        dateOfComplaint: currentDate.toLocaleDateString(),
                        timeOfComplaint: currentDate.toLocaleTimeString(),
                        imageUrl: currentImage,
                        location,
                        status: 'submitted',
                        api_Response: response.data,
                    }];
        
                    localStorage.setItem('imageDetails', JSON.stringify(newDetails));
        
                    return newDetails;
                });

                setCurrentImage(null);
                setLocation("");
                setShowLiveCaptureSubmit(false);
                setCurrentImage(null);
                setLocation("");

                toast({
                    title: "Complaint registered successfully.",
                    description: "Your trash image and location are saved.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

            } catch (error) {
                console.error("Error uploading image:", error.message);
                toast({
                    title: "Error uploading image.",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <VStack spacing={0} align="stretch" h="100vh">
            {/* <UserNav /> */}
            <Fade in={true}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} px={6} gridTemplateColumns={{ base: "1fr", md: "1fr 3fr" }}>
                    <Box
                        borderWidth="1px"
                        borderRadius="xl"
                        p={4}
                        w="100%"
                        shadow="xl"
                        boxShadow="8px 8px 8px 0px rgba(16,185,129,0.6)">
                        <Tabs variant="enclosed">
                            <TabList>
                                <Tab>Upload Image</Tab>
                                <Tab>Live Capture</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <VStack align="center" spacing={4} h="2xl">
                                        <Heading>Upload Image</Heading>
                                        <hr />
                                        <FormControl>
                                            <FormLabel>Image</FormLabel>
                                            <Input h={"50px"} pt={"2"} type="file" accept="image/*" onChange={handleImageChange} />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Location</FormLabel>
                                            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                                        </FormControl>
                                        <Button mt={4} onClick={handleUpload}>
                                            Submit
                                        </Button>
                                    </VStack>
                                </TabPanel>
                                {/* <TabPanel>
                                    <VStack align="center" spacing={4} h="2xl">
                                        <Heading>Live Capture</Heading>
                                        <hr />
                                        <CapturePhoto onCapture={handleLiveCapture} />
                                        {showLiveCaptureSubmit && (
                                            <>
                                                <FormControl mt={4}>
                                                    <FormLabel>Location</FormLabel>
                                                    <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                                                </FormControl>
                                                <Button mt={4} onClick={handleUpload}>
                                                    Submit
                                                </Button>
                                            </>
                                        )}
                                    </VStack>
                                </TabPanel> */}
                            </TabPanels>
                        </Tabs>
                    </Box>

                    <Box
                        borderWidth="1px"
                        borderRadius="xl"
                        p={4}
                        w="100%"
                        shadow="xl"
                        boxShadow="8px 8px 8px 0px rgba(16,185,129,0.6)">
                        <VStack align="center" spacing={4}>
                            <Heading>Submitted Complaints</Heading>
                            <hr />
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="100%">
                                {imageDetails.map((detail) => (
                                    <Box
                                        key={detail.complaintNumber}
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        p={4}
                                        w="100%"
                                        shadow="lg"
                                        _hover={{ shadow: "2xl", transform: "translateY(-4px)", transition: "0.3s" }}
                                    >
                                        <Text><b>Complaint No : </b>{detail.complaintNumber}</Text>
                                        <Text><b>Date: </b>{detail.dateOfComplaint}</Text>
                                        <Text><b>Time: </b>{detail.timeOfComplaint}</Text>
                                        <Box mt={2} mb={2}>
                                            <Image src={detail.imageUrl} alt="Uploaded Trash" boxSize={{ base: "150px", md: "200px" }} />
                                        </Box>
                                        <Text><b>Location: </b>{detail.location}</Text>
                                        <Text><b>Status: </b>{detail.status}</Text>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    </Box>
                </SimpleGrid>
            </Fade>
            {/* <Footer /> */}
        </VStack>
    );
};

export default Complain;
