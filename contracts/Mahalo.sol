pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";
interface ERC20 {
  function balanceOf(address owner) external view returns (uint);
  function allowance(address owner, address spender) external view returns (uint);
  function approve(address spender, uint value) external returns (bool);
  function transfer(address to, uint value) external returns (bool);
  function transferFrom(address from, address to, uint value) external returns (bool); 
}

/// @title A membership ERC721 Citadel token
/// @author tian0
/// @notice You can use this contract for basic member enrollment and verification
/// @dev All function calls are currently implemented without side effects
contract Mahalo is ERC721Full, Ownable, Pausable {

    uint public reserveBalance;
    address public reserveCurrency; //Rinkeby USDC = 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b;
    uint public contribution; 
    
    constructor(address _reserveCurrency, uint _contribution) 
    public 
    ERC721Full('Mahalo', 'MHL') //NFT Name and ticker for Etherscan
    {
        reserveCurrency = _reserveCurrency;
        contribution = _contribution;
        owner();
    }

    address[] public members;
    uint public gasUsed;
    mapping (address => bool) public whiteList;
    mapping (address => uint) public tokenId;
    mapping (address => bool) public enrolled;

    modifier isWhitelisted (address _address) { 
        require (whiteList[_address]); 
        _;}
    modifier notMember (address _address) { 
        require (!enrolled[_address]); 
        _;}
    modifier isMember (address _address) { 
        require (enrolled[_address]);
        _;}

    event Whitelist(address _member);
    event Contribute(address _member);
    event Withdraw(address _owner);

    /// @notice Whitelist addresses for known members/contributors 
    /// @dev Only owner can invoke, gasUsed is owner's expense
    function whitelist(address[] memory _addresses) 
    public 
    onlyOwner()
    whenNotPaused()
    returns(uint)
    {   
        uint startGas = gasleft();
        for (uint i = 0; i < _addresses.length; i++) 
        {
            require(whiteList[_addresses[i]] == false);
            whiteList[_addresses[i]] = true;
            emit Whitelist(_addresses[i]);
        }
        gasUsed = startGas - gasleft();
        return gasUsed;
    }
    
    /// @notice Enroll new member if not yet member and address is whitelisted 
    /// @dev Minted new member token approvals are not given, token becomes untransferrable/unsellable
    /// @dev New member's reserveCurrency balance must be >= contribution, must also hold eth for gas cost
    function contribute()
    public 
    notMember(msg.sender)
    isWhitelisted(msg.sender)
    whenNotPaused()
    {
        require(members.length < 80, 'member maximum is 80');
        tokenId[msg.sender] = members.length;
        members.push(msg.sender);
        enrolled[msg.sender] = true;
        _mint(msg.sender, tokenId[msg.sender]);

        reserveBalance += contribution;
        require(ERC20(reserveCurrency).transferFrom(msg.sender, address(this), contribution));
        emit Contribute(msg.sender);
    }

    /// @notice Withdrawal Pattern for reserveBalance into owner wallet
    /// @dev Will only withdraw to owner and reset reserveBalance to zero
    function withdraw()
	public
    onlyOwner()
    {
        uint amount = reserveBalance;
	    reserveBalance = 0;
        bool success = ERC20(reserveCurrency).transfer(msg.sender, amount);
        require(success);
        emit Withdraw(msg.sender);
    }

    /// @notice Get members address array
    /// @dev Returns existing members
    /// @return members
    function getMembers() 
    public
    view 
    returns(address[] memory) 
    {
        return members;
    }

    /// @notice Get members address array length
    /// @dev Returns existing members count
    /// @return members array length
    function getMembersLength() 
    public
    view 
    returns(uint256) 
    {
        return members.length;
    }

    /// @notice Kill contract 
    /// @dev Only contract owner can kill contract
    function kill() 
    public 
    onlyOwner()
    {
        selfdestruct(address(uint160(owner()))); // cast owner to address payable
    }
    
    /// @notice Will not allow ether deposits
    /// @dev Contract function call gas costs are paid by the address that invokes them
    function fallback()
    external
    payable 
    {
        revert();
    }
}