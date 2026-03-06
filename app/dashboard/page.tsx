import { getSession} from "@/lib/auth/auth";
import connectDB from "@/lib/db"
import { Board } from "@/lib/model";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/Kanban-board";
import { Suspense } from "react";

async function  getBoard(userId : string) {
  //we make this only cache component
  "use cache"
  await connectDB();

  const boardDoc = await Board.findOne({
    userId: userId,
    name: "Job Hunt",
  }).populate({ // i have know more about it
    path: "columns",
    populate: {
      path: "jobApplications",
    },
  });

  if(!boardDoc) return null;
  //here data in not is object form cuz of moongose
  const board = JSON.parse(JSON.stringify(boardDoc)) ;
  return board;
}

async function DashboardPage () {
  const session = await getSession();
  const board = await getBoard(session?.user.id ?? "");

  if(!session?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black" >Job Hunt</h1>
          <p className="text-gray-600">Track your Applications</p>
        </div>

        <KanbanBoard 
          board={board}
          userId={session.user.id}
        />
      </div>
    </div>
  )
}

const dashBoard = async () => {
  return (
    //react comp. its wait for something sync during this time its show fallback message or lazy loadiing
    <Suspense fallback={<p>Loading...</p>}> 
      <DashboardPage />
    </Suspense>
  )
}

export default dashBoard