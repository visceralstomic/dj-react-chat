import {screen, render} from "@testing-library/react";
import RegisterForm from "../components/registerForm";
import userEvent from "@testing-library/user-event";
import {BrowserRouter as Router } from "react-router-dom";
import GlobalStoreProvider from "../store/globalStore";


test("render register from page", () => {
	render(
		<GlobalStoreProvider>
			<Router>
				<RegisterForm />
			</Router>
		</GlobalStoreProvider>
	);

	const spanElem = screen.getByText(/Already registered?/i);
	const buttonElem = screen.getByRole('button', {name: "Create account"});

	expect(spanElem).toBeInTheDocument();
	expect(buttonElem).toBeInTheDocument();
});


test('form error', async () => {
	render(
		<GlobalStoreProvider>
			<Router>
				<RegisterForm />
			</Router>
		</GlobalStoreProvider>
	);

	const buttonElem = screen.getByRole('button', {name: "Create account"});
	await userEvent.click(buttonElem);

	expect(await screen.findByText(/This field may not be blank./i)).toBeInTheDocument();

});