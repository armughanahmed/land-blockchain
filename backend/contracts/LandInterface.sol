pragma solidity ^0.6.0;

interface LandInterface {
    struct RequestForLand {
        uint256 RID;
        bool status;
        bool approval;
        address companyAddress;
        string encryptedData;
        string docHash;
    }

    function sendRequest(string calldata encryptedData, string calldata docHash)
        external
        returns (uint256);

    function checkRequest(uint256 RID)
        external
        view
        returns (
            uint256,
            bool,
            bool,
            address,
            string memory,
            string memory
        );

    function setHash(uint256 RID, string calldata toSet) external;

    function acceptRequest(uint256 RID, string calldata hash) external;

    function rejectRequest(uint256 RID) external;

    function checkContractBalance() external view returns (uint256);

    event RequestSent(
        address indexed from,
        address indexed to,
        uint256 value,
        uint256 RID
    );
    event DecisionOnRequest(uint256 RID, bool status, bool approval);
}
