import ProjectsList from './components/ProjectsList';
import { NavLink } from 'react-router';
function MainApp() {

    // const screens = useState([1, 2, 3])


    return (
        <>
            <main className="flex-1 bg-gray-50 p-6 overflow-x-auto">
                <div className="flex space-x-4">
                    <div className="min-h-screen w-full flex relative items-center justify-center p-4">
                        <div className="absolute top-5 right-5">
                            <NavLink to={'create-project'}>
                                <button className='px-4 cursor-pointer  py-2 bg-green-500 text-white rounded-md'>+ New Project</button>
                            </NavLink>

                        </div>
                        <ProjectsList />

                    </div>

                    {/* {screens.map((_, index) => (
          <div
            key={index}
            className="w-64 h-[400px] bg-white border rounded shadow flex flex-col items-center justify-center"
          >
            <div className="w-48 h-64 bg-black rounded"></div>
            <p className="mt-4 font-semibold text-sm">Insert your text here</p>
          </div>
        ))} */}
                </div>
            </main>
        </>
    )
}


export default MainApp
