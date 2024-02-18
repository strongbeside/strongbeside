import React, { useState, useEffect } from "react";
import axios from "axios";
import common from "../../data/common";
import Pagination from "./UserPagination";

const UserList = () => {
  const [search, setSearch] = useState("");
  const [lists, setLists] = useState([]);
  const router = useRouter();
  /*pagination*/
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPosts, setCurrentPosts] = useState([]);
  const postsPerPage = 10;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost= indexOfLastPost - postsPerPage;

  useEffect(() => {
    const userData = async () => {
      await axios
      .get(common.baseURL + "user")
      .then((res) => {
        setLists(res.data.patientList)
        setCurrentPosts(res.data.patientList.slice(indexOfFirstPost, indexOfLastPost))
        setCurrentPage(1)
      });
    };
    userData();
  }, []);

  useEffect(() => {
    setCurrentPosts(lists.slice(indexOfFirstPost, indexOfLastPost))
  }, [indexOfFirstPost, indexOfLastPost, lists])

  const onSearch = (e) => {
    e.preventDefault();
    if (search === null || search === '') {
      axios.get(common.baseURL + "user")
      .then((res) => {
        setLists(res.data.userList)
        setCurrentPosts(res.data.userlist.slice(indexOfFirstPost, indexOfLastPost))
      });
    } else {
      const filterData = lists.filter((row) => row.userid.includes(search))
      setLists(filterData)
      setCurrentPosts(filterData.slice(indexOfFirstPost, indexOfLastPost))
      setCurrentPage(1)
    }
    setSearch('')
  }

  const onChangeSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  return (
    <>
    <form onSubmit={e => onSearch(e)}>
      <input
      type="text"
      value={search}
      placeholder="아이디를 검색하세요."
      onChange={onChangeSearch}
    />
    <button type='submit'>검색</button>
    </form>

    <div className="w-full">
      <table className="min-w-full">
        <thead>
          <tr>
            <th>번호</th>
            <th>아이디</th>
          </tr>
        </thead>

        {currentPosts.map((val, index) => {
          return (
            <tbody key={val.id}>
              <tr>
                <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                <td>{val.userId}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
      <div className="pagination">
        <Pagination
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        totalPosts={lists.length}
        paginate={setCurrentPage}
        />
      </div>
    </div>
    </>
  );
};

export default UserList;