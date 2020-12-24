pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LandInterface.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Land is Context, IERC20, LandInterface {
    using SafeMath for uint256;
    using SafeMath for uint256;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(uint256 => address) private _companyAddress;
    address private _minter;
    uint256 private _totalSupply;
    uint256 private _costWei;
    uint256 private _costToken;
    uint256 private _RIDglobal;
    address payable _LDaddress;
    modifier onlyLD() {
        require(isLD(), "Only Department of Land has permission to do this");
        _;
    }

    function isLD() public view returns (bool) {
        return _msgSender() == _minter;
    }

    RequestForLand[] public requests;

    function acceptRequest(uint256 RID, string memory hash)
        public
        override
        onlyLD
    {
        require(_getRequestStatus(RID) == false, "Request has been decided.");
        _setRequestStatus(RID, true);
        _setRequestApproval(RID, true);
        _setHash(RID, hash);
        emit DecisionOnRequest(
            RID,
            _getRequestStatus(RID),
            _getRequestApproval(RID)
        );
    }

    function sendRequest(string memory encryptedData, string memory docHash)
        public
        override
        returns (uint256)
    {
        require(
            balanceOf(_msgSender()) >= _costToken,
            "Not enough tokens in your account"
        );
        transfer(_minter, _costToken);
        _companyAddress[_RIDglobal] = _msgSender();
        requests.push(
            RequestForLand(
                _RIDglobal,
                false,
                false,
                _msgSender(),
                encryptedData,
                docHash
            )
        );
        emit RequestSent(_msgSender(), _minter, _costToken, _RIDglobal);
        _RIDglobal += 1;
        return _RIDglobal - 1;
    }

    function getGlobalId() public view returns (uint256) {
        return _RIDglobal;
    }

    function rejectRequest(uint256 RID) public override onlyLD {
        require(
            balanceOf(_minter) >= _costToken,
            "Not enough tokens in minter account to transfer."
        );
        require(_getRequestStatus(RID) == false, "Request has been decided.");
        _setRequestStatus(RID, true);
        _setRequestApproval(RID, false);
        _transfer(_minter, requests[RID].companyAddress, _costToken);
        emit DecisionOnRequest(
            RID,
            _getRequestStatus(RID),
            _getRequestApproval(RID)
        );
    }

    function checkRequest(uint256 RID)
        public
        override
        view
        returns (
            uint256,
            bool,
            bool,
            address,
            string memory,
            string memory
        )
    {
        return (
            RID,
            _getRequestStatus(RID),
            _getRequestApproval(RID),
            _getRequestAddress(RID),
            _getRequestData(RID),
            _getRequestHash(RID)
        );
    }

    function setHash(uint256 RID, string memory toSet) public override onlyLD {
        require(
            _getRequestApproval(RID) == true,
            "This request has not been approved."
        );
        _setHash(RID, toSet);
    }

    function checkContractBalance() public override view returns (uint256) {
        return address(this).balance;
    }

    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public override view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender)
        public
        override
        view
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        require(
            sender == _msgSender() || amount <= allowance(sender, _msgSender()),
            "Your transaction exceeds the sender's allowance"
        );
        _transfer(sender, recipient, amount);
        _approve(
            sender,
            _msgSender(),
            _allowances[sender][_msgSender()].sub(amount)
        );
        return true;
    }

    function sendToken() public payable {
        require(msg.value == _costWei, "not enough wei");
        _transfer(_minter, msg.sender, _costToken);
    }

    function increaseAllowance(address spender, uint256 addedValue)
        public
        returns (bool)
    {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender].add(addedValue)
        );
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        returns (bool)
    {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender].sub(subtractedValue)
        );
        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] = _balances[sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal onlyLD {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal onlyLD {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount);
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        _approve(
            account,
            _msgSender(),
            _allowances[account][_msgSender()].sub(amount)
        );
    }

    function _burnContract() private onlyLD {
        require(
            checkContractBalance() >= _costWei,
            "Not enough wei on this contract to burn."
        );
        address(0x0).transfer(_costWei); //proof of burn
    }

    function _getRequestHash(uint256 RID) private view returns (string memory) {
        return requests[RID].docHash;
    }

    function _getRequestApproval(uint256 RID) private view returns (bool) {
        return requests[RID].approval;
    }

    function _getRequestAddress(uint256 RID) private view returns (address) {
        return requests[RID].companyAddress;
    }

    function _getRequestStatus(uint256 RID) private view returns (bool) {
        return requests[RID].status;
    }

    function _getRequestData(uint256 RID) private view returns (string memory) {
        return requests[RID].encryptedData;
    }

    function _setRequestStatus(uint256 RID, bool toSet) private onlyLD {
        require(RID <= _RIDglobal, "Your RID is incorrect.");
        requests[RID].status = toSet;
    }

    function _setRequestApproval(uint256 RID, bool decision) private onlyLD {
        require(RID <= _RIDglobal, "Your RID is incorrect.");
        requests[RID].approval = decision;
    }

    function _setHash(uint256 RID, string memory setHash) private onlyLD {
        require(RID <= _RIDglobal, "Your RID is incorrect.");
        requests[RID].docHash = setHash;
    }

    constructor() public {
        _minter = _msgSender();
        _LDaddress = _msgSender();
        _costWei = 1000000000000000000;
        _costToken = 100;
        _RIDglobal = 0;
        _mint(_minter, 1000000000000);
    }
}
