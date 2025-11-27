// src/pdf/LandAllotmentLetterPdf.tsx
import React from "react";
import {
	Document,
	Page,
	Text,
	View,
	Image,
	StyleSheet,
} from "@react-pdf/renderer";

export type LandAllotmentPdfProps = {
	date: string; // e.g. "24/11/2025"
	memberName: string;
	memberId: string;
	landName: string;
	unit: string;
	surveyNo: string;
	address: string;
};

const styles = StyleSheet.create({
	page: {
		padding: 24,
		backgroundColor: "#f3f4f6",
		fontFamily: "Helvetica",
	},
	card: {
		flexDirection: "column",
		backgroundColor: "#ffffff",
		borderRadius: 8,
		paddingBottom: 12,
	},
	header: {
		alignItems: "center",
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "#ffffff",
	},
	headerStripeTop: {
		height: 4,
		backgroundColor: "#FF9933",
	},
	headerStripeBottom: {
		height: 4,
		backgroundColor: "#138808",
	},
	logo: {
		height: 40,
		marginBottom: 6,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	website: {
		fontSize: 10,
		color: "#4b5563",
		textAlign: "center",
		marginTop: 2,
	},
	body: {
		paddingHorizontal: 18,
		paddingTop: 10,
	},
	rowBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 6,
	},
	label: {
		fontSize: 11,
		fontWeight: "bold",
	},
	value: {
		fontSize: 11,
	},
	divider: {
		marginVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
	},
	para: {
		fontSize: 11,
		lineHeight: 1.5,
		marginBottom: 8,
		textAlign: "justify",
	},
	signatureBlock: {
		paddingHorizontal: 18,
		paddingTop: 8,
	},
	signatureLabel: {
		fontSize: 11,
		fontWeight: "bold",
	},
	signatureSub: {
		fontSize: 10,
		color: "#4b5563",
		marginTop: 2,
	},
	footer: {
		marginTop: 10,
		paddingHorizontal: 18,
		paddingVertical: 6,
		borderTopWidth: 1,
		borderTopColor: "#e5e7eb",
	},
	footerText: {
		fontSize: 9,
		color: "#6b7280",
		lineHeight: 1.4,
	},
});

export default function LandAllotmentLetterPdf({
	date,
	memberName,
	memberId,
	landName,
	unit,
	surveyNo,
	address,
}: LandAllotmentPdfProps) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.card}>
					{/* Header stripes + logo */}
					<View style={styles.headerStripeTop} />
					<View style={styles.header}>
						<Image
							style={styles.logo}
							src="https://res.cloudinary.com/diaoy3wzi/image/upload/f_auto,q_70,w_300/v1756982391/vrKP-4_no_bg_jndjxt.png"
						/>
						<Text style={styles.title}>
							VR Kisan Parivaar Land Allotment Letter
						</Text>
						<Text style={styles.website}>Website: www.vrkisanparivaar.com</Text>
					</View>
					<View style={styles.headerStripeBottom} />

					{/* Body */}
					<View style={styles.body}>
						{/* Date */}
						<View style={styles.rowBetween}>
							<Text style={styles.label}>Date:</Text>
							<Text style={styles.value}>{date}</Text>
						</View>

						<View style={styles.divider} />

						{/* Details block */}
						<View>
							<View style={styles.rowBetween}>
								<Text style={styles.label}>Name</Text>
								<Text style={styles.value}>{memberName}</Text>
							</View>
							<View style={styles.rowBetween}>
								<Text style={styles.label}>Member Id</Text>
								<Text style={styles.value}>{memberId}</Text>
							</View>
							<View style={styles.rowBetween}>
								<Text style={styles.label}>Land</Text>
								<Text style={styles.value}>{landName}</Text>
							</View>
							<View style={styles.rowBetween}>
								<Text style={styles.label}>Unit</Text>
								<Text style={styles.value}>{unit}</Text>
							</View>
							<View style={styles.rowBetween}>
								<Text style={styles.label}>Survey No.</Text>
								<Text style={styles.value}>{surveyNo}</Text>
							</View>
							<View style={{ marginTop: 4 }}>
								<Text style={styles.label}>Address</Text>
								<Text style={[styles.value, { marginTop: 2 }]}>{address}</Text>
							</View>
						</View>

						<View style={[styles.divider, { marginTop: 10 }]} />

						{/* Main content text */}
						<Text style={styles.para}>
							Under the{" "}
							<Text style={{ fontWeight: "bold" }}>
								Lifetime Membership Program
							</Text>
							, the above member is allotted agricultural land as detailed
							above.
						</Text>
						<Text style={styles.para}>
							The member is understood to have agreed to lease the land for{" "}
							<Text style={{ fontWeight: "bold" }}>
								VRKP agricultural purposes
							</Text>{" "}
							for a period of{" "}
							<Text style={{ fontWeight: "bold" }}>5 years</Text> from the date
							of allotment.
						</Text>
						<Text style={styles.para}>
							Members cannot sell, transfer, or claim ownership during the lease
							period. After the completion of the lease tenure, the land will be
							available for sale only if mutually agreed by other members linked
							to the site, and the sale proceeds will be paid through{" "}
							<Text style={{ fontWeight: "bold" }}>VR Kisan Parivaar</Text> at
							the prevailing market rate at that time.
						</Text>
						<Text style={styles.para}>
							This allotment is a{" "}
							<Text style={{ fontWeight: "bold" }}>
								membership benefit only
							</Text>{" "}
							and does not grant ownership or property rights. All matters are
							subject to the jurisdiction of{" "}
							<Text style={{ fontWeight: "bold" }}>Hyderabad, Telangana</Text>.
						</Text>
					</View>

					{/* Signature */}
					<View style={styles.signatureBlock}>
						<Text style={styles.signatureLabel}>For VR Kisan Parivaar</Text>
						<Text style={styles.signatureSub}>
							Authorized Signatory (Digitally Authorized)
						</Text>
					</View>

					{/* Footer note */}
					<View style={styles.footer}>
						<Text style={styles.footerText}>
							Note: This is a system-generated document under the VRKP
							Membership Program. It does not require a member signature and
							does not confer ownership or legal title.
						</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
}
