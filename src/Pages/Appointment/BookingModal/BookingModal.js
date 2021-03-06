import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import useAuth from "../../../Hooks/useAuth";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
const BookingModal = ({
	booking,
	BookingOpen,
	handleBookingClose,
	date,
	setBookingSuccess,
}) => {
	const { user } = useAuth();
	const { name, time } = booking;

	const initialInfo = {
		patientName: user.displayName,
		email: user.email,
		phone: "",
	};
	const [bookingInfo, setBookingInfo] = useState(initialInfo);
	const handleOnBlur = (e) => {
		const field = e.target.name;
		const value = e.target.value;
		const newInfo = { ...bookingInfo };
		newInfo[field] = value;
		// console.log(newInfo);
		setBookingInfo(newInfo);
	};

	const handleBookingSubmit = (e) => {
		// collect data-----
		const appointment = {
			...bookingInfo,
			time,
			serviceName: name,
			date: date.toLocaleDateString(),
		};
		console.log(appointment);
		// send to the server-----

		fetch("http://localhost:5000/appointments", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(appointment),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.insertedId) {
					setBookingSuccess(true);
					handleBookingClose();
				}
			});

		e.preventDefault();
	};
	return (
		<Modal
			open={BookingOpen}
			onClose={handleBookingClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				<Typography id="modal-modal-title" variant="h6" component="h2">
					{name}
				</Typography>
				<form onSubmit={handleBookingSubmit}>
					<TextField
						sx={{ width: "90%", my: 1 }}
						disabled
						id="outlined-size-small"
						defaultValue={time}
						size="small"
					/>
					<TextField
						sx={{ width: "90%", my: 1 }}
						id="outlined-size-small"
						name="patientName"
						onBlur={handleOnBlur}
						defaultValue={user.displayName}
						size="small"
					/>
					<TextField
						sx={{ width: "90%", my: 1 }}
						id="outlined-size-small"
						name="email"
						onBlur={handleOnBlur}
						defaultValue={user.email}
						size="small"
					/>
					<TextField
						sx={{ width: "90%", my: 1 }}
						id="outlined-size-small"
						name="phone"
						onBlur={handleOnBlur}
						defaultValue="your phone number"
						size="small"
					/>
					<TextField
						sx={{ width: "90%", my: 1 }}
						disabled
						id="outlined-size-small"
						defaultValue={date.toDateString()}
						size="small"
					/>
					<Button type="submit" variant="contained">
						Book
					</Button>
				</form>
			</Box>
		</Modal>
	);
};

export default BookingModal;
