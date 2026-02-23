"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Swords, Globe } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChallengeCard } from "@/components/social/challenge-card";
import { CreateChallengeDialog } from "@/components/social/create-challenge-dialog";
import { ChallengeDetails } from "@/components/social/challenge-details";
import type { Id } from "@/convex/_generated/dataModel";

export default function ChallengesPage() {
  const myChallenges = useQuery(api.challenges.getMyChallenges);
  const availableChallenges = useQuery(api.challenges.getAvailableChallenges);
  const [selectedChallengeId, setSelectedChallengeId] = useState<Id<"challenges"> | null>(null);

  if (selectedChallengeId) {
    return (
      <ChallengeDetails
        challengeId={selectedChallengeId}
        onBack={() => setSelectedChallengeId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Challenges</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and join group challenges with friends
          </p>
        </div>
        <CreateChallengeDialog />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Tabs defaultValue="my-challenges">
          <TabsList>
            <TabsTrigger value="my-challenges">
              <Swords className="h-4 w-4 mr-1.5" />
              My Challenges{myChallenges ? ` (${myChallenges.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="discover">
              <Globe className="h-4 w-4 mr-1.5" />
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-challenges">
            <div className="space-y-2">
              {myChallenges === undefined && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Loading...
                </div>
              )}
              {myChallenges && myChallenges.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <Swords className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No challenges yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Create a challenge or join one from friends
                    </p>
                  </div>
                </div>
              )}
              {myChallenges?.map((challenge, i) => (
                <ChallengeCard
                  key={challenge._id}
                  challengeId={challenge._id}
                  title={challenge.title}
                  description={challenge.description}
                  habitTitle={challenge.habitTitle}
                  startDate={challenge.startDate}
                  endDate={challenge.endDate}
                  creatorName={challenge.creatorName}
                  participantCount={challenge.participantCount}
                  isCreator={challenge.isCreator}
                  challengeStatus={challenge.status}
                  index={i}
                  onViewDetails={setSelectedChallengeId}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discover">
            <div className="space-y-2">
              {availableChallenges === undefined && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Loading...
                </div>
              )}
              {availableChallenges && availableChallenges.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No challenges to discover</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your friends haven&apos;t created any challenges yet
                    </p>
                  </div>
                </div>
              )}
              {availableChallenges?.map((challenge, i) => (
                <ChallengeCard
                  key={challenge._id}
                  challengeId={challenge._id}
                  title={challenge.title}
                  description={challenge.description}
                  habitTitle={challenge.habitTitle}
                  startDate={challenge.startDate}
                  endDate={challenge.endDate}
                  creatorName={challenge.creatorName}
                  participantCount={challenge.participantCount}
                  isCreator={false}
                  isParticipant={false}
                  challengeStatus={challenge.status}
                  index={i}
                  onViewDetails={setSelectedChallengeId}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
