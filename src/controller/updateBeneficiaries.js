const Finance = require("../models/userFinance");
const User = require("../models/user")

const update_beneficiaries = async (userFinanceId, userName) => {
    try {

        console.log(`userFinanceId: ${userFinanceId}, userName: ${userName}`)

        // Find the user document 
        const user = await User.findOne({ userName: userName })
        if (!user) {
            console.log("User not found to be able to add to beneficiaries")
            return { success: false, error: "User not found to be able to add to beneficiaries" }
        }


        // Find the user's finance document
        const userFinance = await Finance.findById(userFinanceId);

        if (!userFinance) {
            console.error("Couldn't find userFinance");
            return { success: false, error: "User finance not found" }; // Return early
        }

        let { beneficiaries } = userFinance;

        // Find the beneficiary by userName
        const beneficiaryIndex = beneficiaries.findIndex(
            (item) => item.userName === userName
        );

        if (beneficiaryIndex === -1) {
            // If the beneficiary doesn't exist, add a new one at the top
            beneficiaries.unshift({
                userName: userName,
                accountNumber: user.accountNumber,
            });
        } else {
            // If the beneficiary exists, remove it from its current position
            const [existingBeneficiary] = beneficiaries.splice(beneficiaryIndex, 1);
            // Then, move it to the top
            beneficiaries.unshift(existingBeneficiary);
        }

        // Save the updated userFinance document
        await userFinance.save();

        return { success: true, message: "Beneficiaries updated successfully" };
    } catch (err) {
        console.error("Couldn't update recently transferred", err.message, err);
        return { success: false, error: err.message };
    }
};

module.exports = update_beneficiaries;
