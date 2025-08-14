import { useGetCoursesQuery } from "../store/slices/coursesApiSlice";

const CoursesComponent = () => {
  const { data: courses, isLoading, error } = useGetCoursesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error occurred</p>;

  return (
    <ul>
      {courses?.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
};

export default CoursesComponent;
