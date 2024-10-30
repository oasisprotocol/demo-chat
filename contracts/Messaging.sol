// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./interfaces/IMessaging.sol";
import "./interfaces/IErrors.sol";

contract Messaging is IMessaging, IErrors {
    /// @notice Stores direct messages between two users
    /// @dev Maps sender => receiver => array of messages
    mapping(address => mapping(address => Message[])) private directMessages;

    /// @notice Stores group information
    /// @dev Maps groupId => Group struct
    mapping(uint256 => Group) private groups;

    /// @notice Stores messages for each group
    /// @dev Maps groupId => array of messages
    mapping(uint256 => Message[]) private groupMessages;

    /// @notice Tracks which groups a user is a member of
    /// @dev Maps user address => array of groupIds
    mapping(address => uint256[]) private userGroups;

    /// @notice Counter for generating unique group IDs
    uint256 private nextGroupId = 1;

    /// @notice Sends a direct message to another user
    /// @param to The recipient's address
    /// @param content The message content
    /// @dev Emits DirectMessageSent event
    function sendDirectMessage(address to, string calldata content) external {
        if (to == address(0)) revert InvalidRecipient();
        if (to == msg.sender) revert CannotMessageSelf();

        Message memory newMessage = Message({
            sender: msg.sender,
            content: content,
            timestamp: block.timestamp
        });

        (address addr1, address addr2) = _getMessageKey(msg.sender, to);
        directMessages[addr1][addr2].push(newMessage);

        emit DirectMessageSent(msg.sender, to, content);
    }

    /// @notice Creates a new group with initial members
    /// @param name The name of the group
    /// @param initialMembers Array of addresses to be added as initial members
    /// @return groupId The ID of the newly created group
    /// @dev Creator is automatically added as first member
    function createGroup(
        string calldata name,
        address[] calldata initialMembers
    ) external returns (uint256) {
        if (bytes(name).length == 0) revert EmptyGroupName();

        address[] memory members = new address[](initialMembers.length + 1);
        members[0] = msg.sender;
        userGroups[msg.sender].push(nextGroupId);

        for (uint i = 0; i < initialMembers.length; i++) {
            members[i + 1] = initialMembers[i];
            userGroups[initialMembers[i]].push(nextGroupId);
        }

        uint256 groupId = nextGroupId++;
        groups[groupId] = Group({name: name, members: members, exists: true});

        emit GroupCreated(groupId, name, msg.sender);
        return groupId;
    }

    /// @notice Sends a message to a group
    /// @param groupId The ID of the target group
    /// @param content The message content
    /// @dev Only group members can send messages
    function sendGroupMessage(
        uint256 groupId,
        string calldata content
    ) external {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, msg.sender)) revert NotGroupMember();

        Message memory newMessage = Message({
            sender: msg.sender,
            content: content,
            timestamp: block.timestamp
        });

        groupMessages[groupId].push(newMessage);

        emit GroupMessageSent(groupId, msg.sender, content);
    }

    /// @notice Adds a new member to an existing group
    /// @param groupId The ID of the group
    /// @param newMember The address of the new member
    /// @dev Only existing group members can add new members
    function addGroupMember(uint256 groupId, address newMember) external {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, msg.sender)) revert OnlyMembersCanAdd();
        if (newMember == address(0)) revert InvalidMemberAddress();
        if (isGroupMember(groupId, newMember)) revert AlreadyGroupMember();

        groups[groupId].members.push(newMember);
        userGroups[newMember].push(groupId);

        emit MemberAdded(groupId, newMember, msg.sender);
    }

    /// @notice Removes a member from an existing group
    /// @param groupId The ID of the group
    /// @param memberToRemove The address of the member to remove
    /// @dev Only existing group members can remove other members
    /// @dev A member cannot remove themselves
    function removeGroupMember(
        uint256 groupId,
        address memberToRemove
    ) external {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, msg.sender)) revert NotGroupMember();
        if (!isGroupMember(groupId, memberToRemove)) revert NotGroupMember();
        if (memberToRemove == msg.sender) revert CannotRemoveSelf();

        // Remove from members array
        address[] storage members = groups[groupId].members;
        uint256 membersLength = members.length;
        for (uint i = 0; i < membersLength; i++) {
            if (members[i] == memberToRemove) {
                members[i] = members[membersLength - 1];
                members.pop();
                break;
            }
        }

        // Remove from user's group list
        uint256[] storage userGroupList = userGroups[memberToRemove];
        uint256 groupsLength = userGroupList.length;
        for (uint i = 0; i < groupsLength; i++) {
            if (userGroupList[i] == groupId) {
                userGroupList[i] = userGroupList[groupsLength - 1];
                userGroupList.pop();
                break;
            }
        }

        emit MemberRemoved(groupId, memberToRemove, msg.sender);
    }

    /// @notice Retrieves direct messages between caller and another user
    /// @param otherUser The address of the other user
    /// @return Array of Message structs
    function getDirectMessages(
        address otherUser
    ) external view returns (Message[] memory) {
        (address addr1, address addr2) = _getMessageKey(msg.sender, otherUser);
        return directMessages[addr1][addr2];
    }

    /// @notice Retrieves messages for a specific group
    /// @param groupId The ID of the target group
    /// @return Array of Message structs
    function getGroupMessages(
        uint256 groupId
    ) external view returns (Message[] memory) {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, msg.sender)) revert NotGroupMember();
        return groupMessages[groupId];
    }

    /// @notice Retrieves details about a specific group
    /// @param groupId The ID of the target group
    /// @return name The name of the group
    /// @return members Array of addresses of group members
    function getGroupDetails(
        uint256 groupId
    ) external view returns (string memory name, address[] memory members) {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        return (groups[groupId].name, groups[groupId].members);
    }

    /// @notice Retrieves groups a user is a member of
    /// @return Array of group IDs
    function getUserGroups() external view returns (uint256[] memory) {
        return userGroups[msg.sender];
    }

    /// @notice Retrieves groups a specific user is a member of
    /// @param user The address of the user
    /// @return Array of group IDs
    function getUserGroupsByAddress(
        address user
    ) external view returns (uint256[] memory) {
        return userGroups[user];
    }

    /// @notice Retrieves all addresses that the caller has exchanged messages with
    /// @return Array of addresses that the caller has DM history with
    function getDirectMessageContacts()
        external
        view
        returns (address[] memory)
    {
        address[] memory contacts = new address[](0);
        uint256 count = 0;

        // First pass to count unique contacts
        for (uint256 i = 0; i < contacts.length; i++) {
            if (
                directMessages[msg.sender][contacts[i]].length > 0 ||
                directMessages[contacts[i]][msg.sender].length > 0
            ) {
                count++;
            }
        }

        // Second pass to populate array
        address[] memory result = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < contacts.length; i++) {
            if (
                directMessages[msg.sender][contacts[i]].length > 0 ||
                directMessages[contacts[i]][msg.sender].length > 0
            ) {
                result[index] = contacts[i];
                index++;
            }
        }

        return result;
    }

    /// @notice Checks if a user is a member of a specific group
    /// @param groupId The ID of the target group
    /// @param user The address of the user
    /// @return bool True if the user is a member of the group, false otherwise
    function isGroupMember(
        uint256 groupId,
        address user
    ) public view returns (bool) {
        address[] memory members = groups[groupId].members;
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == user) {
                return true;
            }
        }
        return false;
    }

    /// @notice Helper function to get the key for direct messages
    /// @param addr1 The address of the first user
    /// @param addr2 The address of the second user
    /// @return address The address of the first user
    /// @return address The address of the second user
    function _getMessageKey(
        address addr1,
        address addr2
    ) private pure returns (address, address) {
        return addr1 < addr2 ? (addr1, addr2) : (addr2, addr1);
    }
}
